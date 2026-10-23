'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Globe,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { MarketJurisdiction } from '@/lib/qrce-engine';

export interface LiveStockData {
  symbol: string;
  rawQuery: string;
  companyName: string;
  jurisdiction: MarketJurisdiction;
  currency: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  position52WeekPct: number;
  volume: number;
  averageVolume: number;
  monthAveragePrice: number;
  monthReturnPct: number;
  recentCloses: number[];
  lastUpdated: string;
  suggestedFactorScores: {
    fin: number;
    grw: number;
    val: number;
    sen: number;
    rsk: number;
  };
}

interface RealtimeStockServiceProps {
  onTransferToSimulator?: (stock: LiveStockData) => void;
}

const INDIAN_QUICK_PICKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind.', exchange: 'NSE' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy', exchange: 'NSE' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', exchange: 'NSE' },
  { symbol: 'INFY.NS', name: 'Infosys', exchange: 'NSE' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', exchange: 'NSE' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', exchange: 'NSE' },
  { symbol: 'ITC.NS', name: 'ITC Ltd.', exchange: 'NSE' },
  { symbol: '500325.BO', name: 'Reliance (BSE)', exchange: 'BSE' },
];

const GLOBAL_QUICK_PICKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ' },
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
];

// Helper to quantize position percentage for width without inline styles
function getWidthClass(pct: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  if (clamped <= 5) return 'w-[5%]';
  if (clamped <= 10) return 'w-[10%]';
  if (clamped <= 15) return 'w-[15%]';
  if (clamped <= 20) return 'w-[20%]';
  if (clamped <= 25) return 'w-[25%]';
  if (clamped <= 30) return 'w-[30%]';
  if (clamped <= 35) return 'w-[35%]';
  if (clamped <= 40) return 'w-[40%]';
  if (clamped <= 45) return 'w-[45%]';
  if (clamped <= 50) return 'w-[50%]';
  if (clamped <= 55) return 'w-[55%]';
  if (clamped <= 60) return 'w-[60%]';
  if (clamped <= 65) return 'w-[65%]';
  if (clamped <= 70) return 'w-[70%]';
  if (clamped <= 75) return 'w-[75%]';
  if (clamped <= 80) return 'w-[80%]';
  if (clamped <= 85) return 'w-[85%]';
  if (clamped <= 90) return 'w-[90%]';
  if (clamped <= 95) return 'w-[95%]';
  return 'w-full';
}

function formatCurrency(val: number, currency: string): string {
  const prefix = currency === 'INR' ? '₹' : '$';
  return `${prefix}${val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDisplayTime(isoString?: string): string {
  if (!isoString) return 'Market Session Active';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Market Session Active';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return 'Market Session Active';
  }
}

const INITIAL_RELIANCE_DATA: LiveStockData = {
  symbol: 'RELIANCE.NS',
  rawQuery: 'RELIANCE.NS',
  companyName: 'Reliance Industries Limited',
  jurisdiction: 'india_nse_bse',
  currency: 'INR',
  exchange: 'NSE',
  price: 2942.5,
  change: 34.2,
  changePercent: 1.18,
  previousClose: 2908.3,
  dayHigh: 2958.0,
  dayLow: 2912.1,
  fiftyTwoWeekHigh: 3217.9,
  fiftyTwoWeekLow: 2220.3,
  position52WeekPct: 72.4,
  volume: 7421890,
  averageVolume: 6184200,
  monthAveragePrice: 2894.6,
  monthReturnPct: 4.82,
  recentCloses: [2860, 2875, 2890, 2880, 2905, 2910, 2925, 2908, 2942.5],
  lastUpdated: '2026-10-23T15:30:00.000Z',
  suggestedFactorScores: {
    fin: 75,
    grw: 82,
    val: 28,
    sen: 78,
    rsk: 85,
  },
};

export default function RealtimeStockService({
  onTransferToSimulator,
}: RealtimeStockServiceProps) {
  const [market, setMarket] = useState<MarketJurisdiction>('india_nse_bse');
  const [tickerInput, setTickerInput] = useState<string>('RELIANCE.NS');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<LiveStockData | null>(INITIAL_RELIANCE_DATA);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  const fetchQuote = async (symbolToFetch: string, targetMarket: MarketJurisdiction) => {
    if (!symbolToFetch.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(
        `/api/quote?symbol=${encodeURIComponent(symbolToFetch.trim())}&market=${targetMarket}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve stock quote');
      }

      setQuoteData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching quote data';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketChange = (newMarket: MarketJurisdiction) => {
    setMarket(newMarket);
    setErrorMsg(null);
    const defaultSymbol = newMarket === 'india_nse_bse' ? 'RELIANCE.NS' : 'NVDA';
    setTickerInput(defaultSymbol);
    fetchQuote(defaultSymbol, newMarket);
  };

  const handleQuickPick = (symbol: string) => {
    setTickerInput(symbol);
    fetchQuote(symbol, market);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      fetchQuote(tickerInput, market);
    }
  };

  const handleTransfer = () => {
    if (!quoteData) return;
    if (onTransferToSimulator) {
      onTransferToSimulator(quoteData);
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 2400);

      // Smooth scroll to the simulator section
      const simulatorEl = document.getElementById('simulator');
      if (simulatorEl) {
        simulatorEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCopyChatbotPrompt = () => {
    if (!quoteData) return;
    const isIndia = quoteData.jurisdiction === 'india_nse_bse';
    const currencySign = quoteData.currency === 'INR' ? '₹' : '$';

    const promptText = `Please run a full Quantitative Rating & Conversion Engine (QRCE v3.1.0) analysis for:
TICKER: ${quoteData.symbol} (${quoteData.companyName})
EXCHANGE: ${quoteData.exchange} (${isIndia ? 'Indian Market: NSE / BSE' : 'US Market: SEC / NASDAQ / NYSE'})
LAST PRICE: ${currencySign}${quoteData.price.toFixed(2)} (${quoteData.change >= 0 ? '+' : ''}${quoteData.change.toFixed(2)}, ${quoteData.changePercent >= 0 ? '+' : ''}${quoteData.changePercent.toFixed(2)}%)
52-WEEK RANGE: ${currencySign}${quoteData.fiftyTwoWeekLow.toFixed(2)} - ${currencySign}${quoteData.fiftyTwoWeekHigh.toFixed(2)} (Trading at ${quoteData.position52WeekPct.toFixed(1)}% of 52-week high)
TODAY'S VOLUME: ${quoteData.volume.toLocaleString()} (30-day Avg: ${quoteData.averageVolume.toLocaleString()})
1-MONTH RETURN: ${quoteData.monthReturnPct >= 0 ? '+' : ''}${quoteData.monthReturnPct.toFixed(2)}%

${
  isIndia
    ? `SPECIFIC REGULATORY CHECKS REQUIRED:
1. SEBI LODR Regulation 33 & Ind AS 7 compliance (Operating Cash Flow vs Reported PAT).
2. SEBI PIT Regulation 7 promoter shareholding & pledge percentage (>20% pledge penalty check).
3. Current RBI MPC monetary policy regime alignment.`
    : `SPECIFIC REGULATORY CHECKS REQUIRED:
1. SEC Form 10-K/10-Q cash conversion sanity check (FCF vs Net Income).
2. SEC EDGAR Form 4 insider transaction patterns.
3. US Federal Reserve rate environment alignment.`
}

Output the deterministic Institutional CQS Score, Factor Weight Breakdown, and the 80-column Institutional Terminal Block.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const isPositive = (quoteData?.change ?? 0) >= 0;

  return (
    <section id="realtime" className="border-b border-slate-200 bg-slate-50/70 py-12">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              <span>Real-Time Market Service Component</span>
            </div>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
              Live Stock Data Service (NSE, BSE &amp; Global Equities)
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Connect to live price feeds for Indian National Stock Exchange (NSE) and Bombay Stock Exchange
              (BSE), alongside US Global markets. Maps real-time price action and 52-week position directly into
              initial QRCE factor scores for rating and conversion.
            </p>
          </div>

          {/* Market Toggle: Indian vs Global */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleMarketChange('india_nse_bse')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                market === 'india_nse_bse'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Indian Equities (NSE / BSE)
            </button>
            <button
              type="button"
              onClick={() => handleMarketChange('us_global')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                market === 'us_global'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              US &amp; Global (NASDAQ / NYSE)
            </button>
          </div>
        </div>

        {/* Ticker Search & Quick Picks Bar */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <form onSubmit={handleManualSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                placeholder={
                  market === 'india_nse_bse'
                    ? 'Enter Indian Ticker (e.g. RELIANCE.NS, TCS.NS, 500325.BO)'
                    : 'Enter US Ticker (e.g. NVDA, AAPL, MSFT, GOOGL)'
                }
                className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Fetching Quote...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Fetch Real-Time Quote</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Pick Symbols */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500 mr-1">
              {market === 'india_nse_bse' ? 'NSE/BSE Watchlist:' : 'Global Watchlist:'}
            </span>
            {(market === 'india_nse_bse' ? INDIAN_QUICK_PICKS : GLOBAL_QUICK_PICKS).map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => handleQuickPick(stock.symbol)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  quoteData?.symbol === stock.symbol
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="font-semibold">{stock.symbol}</span>
                <span className="ml-1 text-[11px] text-slate-500">({stock.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900">
            <div className="font-bold">Error Fetching Real-Time Quote</div>
            <p className="mt-1">{errorMsg}</p>
          </div>
        )}

        {/* Live Quote Display Panel */}
        {quoteData && (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {/* Top Bar: Company & Exchange Badge */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
                    {quoteData.companyName}
                  </h3>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                    {quoteData.symbol}
                  </span>
                  <span className="rounded-md bg-blue-900/80 px-2 py-0.5 text-xs font-semibold text-blue-200">
                    {quoteData.exchange}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Market Jurisdiction:{' '}
                  <span className="font-medium text-slate-200">
                    {quoteData.jurisdiction === 'india_nse_bse'
                      ? 'India (NSE / BSE / SEBI LODR)'
                      : 'US & Global (SEC / NASDAQ / NYSE)'}
                  </span>{' '}
                  · Currency: <span className="font-medium text-slate-200">{quoteData.currency}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span suppressHydrationWarning className="text-xs font-medium text-slate-300">
                  Live Feed · {formatDisplayTime(quoteData.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Price & Primary Stats Grid */}
            <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              {/* Left Column: Big Price & Change */}
              <div className="p-6 lg:col-span-4 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Current Market Price
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-mono)] text-3xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-4xl">
                    {formatCurrency(quoteData.price, quoteData.currency)}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
                        isPositive ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {formatCurrency(quoteData.change, quoteData.currency)}
                      </span>
                      <span>
                        ({isPositive ? '+' : ''}
                        {quoteData.changePercent.toFixed(2)}%)
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">vs prev close</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Previous Close:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(quoteData.previousClose, quoteData.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">30-Day Avg Price:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(quoteData.monthAveragePrice, quoteData.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">1-Month Return:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        quoteData.monthReturnPct >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {quoteData.monthReturnPct >= 0 ? '+' : ''}
                      {quoteData.monthReturnPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Day Range, 52W Range & Volume */}
              <div className="p-6 lg:col-span-5 space-y-5">
                {/* Day Range Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Day Range</span>
                    <span className="text-slate-500 tabular-nums">
                      {formatCurrency(quoteData.dayLow, quoteData.currency)} –{' '}
                      {formatCurrency(quoteData.dayHigh, quoteData.currency)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-sm bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full bg-slate-700 rounded-sm ${getWidthClass(
                        quoteData.dayHigh > quoteData.dayLow
                          ? ((quoteData.price - quoteData.dayLow) /
                              (quoteData.dayHigh - quoteData.dayLow)) *
                              100
                          : 50
                      )}`}
                    />
                  </div>
                </div>

                {/* 52-Week Range Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">52-Week Range</span>
                    <span className="text-slate-500 tabular-nums">
                      {formatCurrency(quoteData.fiftyTwoWeekLow, quoteData.currency)} –{' '}
                      {formatCurrency(quoteData.fiftyTwoWeekHigh, quoteData.currency)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-sm bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full bg-blue-700 rounded-sm ${getWidthClass(
                        quoteData.position52WeekPct
                      )}`}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500 tabular-nums">
                    <span>52W Low (0%)</span>
                    <span className="font-medium text-blue-800">
                      Current: {quoteData.position52WeekPct.toFixed(1)}% of 52W Span
                    </span>
                    <span>52W High (100%)</span>
                  </div>
                </div>

                {/* Volume & Liquidity */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Current Volume</span>
                    <div className="font-[family-name:var(--font-mono)] font-bold text-slate-900 tabular-nums">
                      {quoteData.volume.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Volume Ratio (vs 30d Avg)</span>
                    <div className="font-[family-name:var(--font-mono)] font-bold text-slate-900 tabular-nums">
                      {(quoteData.averageVolume > 0
                        ? quoteData.volume / quoteData.averageVolume
                        : 1
                      ).toFixed(2)}
                      x
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: QRCE Factor Mapping & Actions */}
              <div className="p-6 lg:col-span-3 flex flex-col justify-between bg-slate-50/30">
                <div>
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    QRCE Factor Mapping
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    Deterministic factor derivation from live market signals:
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs tabular-nums">
                    <div className="flex justify-between items-center rounded-md bg-white p-1.5 border border-slate-100">
                      <span className="font-semibold text-slate-700">S_FIN (Solvency):</span>
                      <span className="font-mono font-bold text-slate-900">
                        {quoteData.suggestedFactorScores.fin > 0 ? '+' : ''}
                        {quoteData.suggestedFactorScores.fin}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-md bg-white p-1.5 border border-slate-100">
                      <span className="font-semibold text-slate-700">S_GRW (52W Trend):</span>
                      <span
                        className={`font-mono font-bold ${
                          quoteData.suggestedFactorScores.grw >= 0
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {quoteData.suggestedFactorScores.grw > 0 ? '+' : ''}
                        {quoteData.suggestedFactorScores.grw}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-md bg-white p-1.5 border border-slate-100">
                      <span className="font-semibold text-slate-700">S_VAL (Valuation):</span>
                      <span
                        className={`font-mono font-bold ${
                          quoteData.suggestedFactorScores.val >= 0
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {quoteData.suggestedFactorScores.val > 0 ? '+' : ''}
                        {quoteData.suggestedFactorScores.val}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-md bg-white p-1.5 border border-slate-100">
                      <span className="font-semibold text-slate-700">S_SEN (Volume/Mom):</span>
                      <span
                        className={`font-mono font-bold ${
                          quoteData.suggestedFactorScores.sen >= 0
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {quoteData.suggestedFactorScores.sen > 0 ? '+' : ''}
                        {quoteData.suggestedFactorScores.sen}
                      </span>
                    </div>
                    <div className="flex justify-between items-center rounded-md bg-white p-1.5 border border-slate-100">
                      <span className="font-semibold text-slate-700">S_RSK (Baseline):</span>
                      <span className="font-mono font-bold text-slate-900">
                        {quoteData.suggestedFactorScores.rsk > 0 ? '+' : ''}
                        {quoteData.suggestedFactorScores.rsk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Transfer & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <button
                    type="button"
                    onClick={handleTransfer}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    {transferSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Transferred to Simulator!</span>
                      </>
                    ) : (
                      <>
                        <span>Transfer to QRCE Simulator</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyChatbotPrompt}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Copied Analysis Prompt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Copy Prompt for Chatbots</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
