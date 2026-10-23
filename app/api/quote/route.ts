import { NextRequest, NextResponse } from 'next/server';

interface YahooChartMeta {
  currency?: string;
  symbol?: string;
  exchangeName?: string;
  fullExchangeName?: string;
  instrumentType?: string;
  regularMarketTime?: number;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  fulldayChange?: number;
  fulldayChangePercent?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  longName?: string;
  shortName?: string;
  chartPreviousClose?: number;
}

interface YahooChartResult {
  meta?: YahooChartMeta;
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: (number | null)[];
      high?: (number | null)[];
      low?: (number | null)[];
      close?: (number | null)[];
      volume?: (number | null)[];
    }>;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawSymbol = searchParams.get('symbol')?.trim();
  const market = searchParams.get('market') || 'india_nse_bse';
  const isIndia = market === 'india_nse_bse';

  if (!rawSymbol) {
    return NextResponse.json(
      { error: 'Please provide a valid stock ticker symbol (e.g., RELIANCE.NS, TCS.BO, NVDA).' },
      { status: 400 }
    );
  }

  // Symbol resolution for Indian vs Global
  let candidateSymbols: string[] = [];
  const upper = rawSymbol.toUpperCase();

  if (isIndia) {
    if (upper.endsWith('.NS') || upper.endsWith('.BO')) {
      candidateSymbols = [upper];
    } else {
      // Try NSE first (.NS), then BSE (.BO)
      candidateSymbols = [`${upper}.NS`, `${upper}.BO`];
    }
  } else {
    // US / Global symbol
    candidateSymbols = [upper];
  }

  let finalResult: YahooChartResult | null = null;
  let resolvedSymbol = candidateSymbols[0];

  for (const sym of candidateSymbols) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        sym
      )}?interval=1d&range=1mo`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const json = await response.json();
        const res = json?.chart?.result?.[0];
        if (res && res.meta && typeof res.meta.regularMarketPrice === 'number') {
          finalResult = res;
          resolvedSymbol = sym;
          break;
        }
      }
    } catch {
      // Try next candidate
    }
  }

  if (!finalResult || !finalResult.meta || typeof finalResult.meta.regularMarketPrice !== 'number') {
    return NextResponse.json(
      {
        error: `Could not retrieve live market quote for "${rawSymbol}". For Indian stocks, try appending .NS (e.g. RELIANCE.NS) or .BO (e.g. 500325.BO). For US stocks, use ticker symbols like NVDA or AAPL.`,
      },
      { status: 404 }
    );
  }

  const meta = finalResult.meta;
  const quoteIndicators = finalResult.indicators?.quote?.[0];
  const closes = (quoteIndicators?.close || []).filter(
    (c): c is number => typeof c === 'number' && !isNaN(c)
  );
  const volumes = (quoteIndicators?.volume || []).filter(
    (v): v is number => typeof v === 'number' && !isNaN(v)
  );

  const price: number = meta.regularMarketPrice ?? (closes.length > 0 ? closes[closes.length - 1] : 0);
  const prevClose: number = meta.chartPreviousClose ?? (closes.length > 1 ? closes[closes.length - 2] : price);
  const change =
    typeof meta.fulldayChange === 'number'
      ? meta.fulldayChange
      : Number((price - prevClose).toFixed(2));
  const changePercent =
    typeof meta.regularMarketChangePercent === 'number'
      ? meta.regularMarketChangePercent
      : prevClose > 0
      ? Number((((price - prevClose) / prevClose) * 100).toFixed(2))
      : 0;

  const dayHigh: number = meta.regularMarketDayHigh ?? price;
  const dayLow: number = meta.regularMarketDayLow ?? price;
  const high52: number = meta.fiftyTwoWeekHigh ?? dayHigh;
  const low52: number = meta.fiftyTwoWeekLow ?? dayLow;
  const volume: number = meta.regularMarketVolume ?? (volumes.length > 0 ? (volumes[volumes.length - 1] ?? 0) : 0);

  const avgVolume =
    volumes.length > 0
      ? Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length)
      : volume;

  const monthAvgPrice =
    closes.length > 0
      ? Number((closes.reduce((a, b) => a + b, 0) / closes.length).toFixed(2))
      : price;

  const monthReturnPct =
    closes.length > 1 && closes[0] > 0
      ? Number((((price - closes[0]) / closes[0]) * 100).toFixed(2))
      : 0;

  // 52-week position percentile (0% = at 52w low, 100% = at 52w high)
  const range52Diff = high52 - low52;
  const position52Pct =
    range52Diff > 0 ? Number((((price - low52) / range52Diff) * 100).toFixed(1)) : 50;

  // Deterministic QRCE initial factor derivations based on market position
  // Growth momentum score: strong if trading above 1-month average and upper half of 52w range
  const priceVsMonthAvg = monthAvgPrice > 0 ? (price - monthAvgPrice) / monthAvgPrice : 0;
  let suggestedGrw = Math.round(position52Pct * 0.8 - 40 + priceVsMonthAvg * 200);
  suggestedGrw = Math.max(-100, Math.min(100, suggestedGrw));

  // Valuation score: value discount higher when trading in lower half of 52w range
  let suggestedVal = Math.round((50 - position52Pct) * 1.5);
  suggestedVal = Math.max(-100, Math.min(100, suggestedVal));

  // Sentiment score: derived from recent daily change and volume ratio
  const volumeRatio = avgVolume > 0 ? volume / avgVolume : 1;
  let suggestedSen = Math.round(changePercent * 5 + (volumeRatio - 1) * 20);
  suggestedSen = Math.max(-100, Math.min(100, suggestedSen));

  // Solvency baseline: neutral positive by default for established bluechips
  const suggestedFin = 65;
  const suggestedRsk = 60;

  const currency = meta.currency || (resolvedSymbol.endsWith('.NS') || resolvedSymbol.endsWith('.BO') ? 'INR' : 'USD');
  const exchange = meta.fullExchangeName || meta.exchangeName || (resolvedSymbol.endsWith('.NS') ? 'NSE' : resolvedSymbol.endsWith('.BO') ? 'BSE' : 'US');
  const companyName = meta.longName || meta.shortName || resolvedSymbol;

  const quoteTime = meta.regularMarketTime
    ? new Date(meta.regularMarketTime * 1000).toISOString()
    : new Date().toISOString();

  return NextResponse.json({
    symbol: resolvedSymbol,
    rawQuery: rawSymbol,
    companyName,
    jurisdiction: resolvedSymbol.endsWith('.NS') || resolvedSymbol.endsWith('.BO') ? 'india_nse_bse' : 'us_global',
    currency,
    exchange,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    previousClose: Number(prevClose.toFixed(2)),
    dayHigh: Number(dayHigh.toFixed(2)),
    dayLow: Number(dayLow.toFixed(2)),
    fiftyTwoWeekHigh: Number(high52.toFixed(2)),
    fiftyTwoWeekLow: Number(low52.toFixed(2)),
    position52WeekPct: position52Pct,
    volume,
    averageVolume: avgVolume,
    monthAveragePrice: monthAvgPrice,
    monthReturnPct,
    recentCloses: closes.slice(-10),
    lastUpdated: quoteTime,
    suggestedFactorScores: {
      fin: suggestedFin,
      grw: suggestedGrw,
      val: suggestedVal,
      sen: suggestedSen,
      rsk: suggestedRsk,
    },
  });
}
