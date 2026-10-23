export type MacroRegimeKey =
  | 'baseline'
  | 'high_rate'
  | 'bull_growth'
  | 'stagflation';

export type RatingLabel =
  | 'STRONG BUY'
  | 'BUY'
  | 'HOLD'
  | 'SELL'
  | 'STRONG SELL';

export type MarketJurisdiction = 'us_global' | 'india_nse_bse';

export interface RegimeDefinition {
  key: MacroRegimeKey;
  label: string;
  templateLabel: string;
  description: string;
  indiaDescription: string;
  weights: {
    fin: number; // W1
    grw: number; // W2
    val: number; // W3
    sen: number; // W4
    rsk: number; // W5
  };
}

export const MACRO_REGIMES: Record<MacroRegimeKey, RegimeDefinition> = {
  baseline: {
    key: 'baseline',
    label: 'Baseline Equilibrium',
    templateLabel: 'Baseline Neutral',
    description: 'Balanced mid-cycle monetary conditions with neutral inflation expectations.',
    indiaDescription: 'Neutral RBI MPC policy stance (Repo ~6.50%), steady CPI in 4-5% band, balanced domestic and export demand.',
    weights: { fin: 0.30, grw: 0.25, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  high_rate: {
    key: 'high_rate',
    label: 'High Interest Rate / Inflation',
    templateLabel: 'High Rate/Inflation',
    description: 'Restrictive monetary policy prioritizing balance-sheet solvency and free cash flow yield.',
    indiaDescription: 'Hawkish RBI stance (Withdrawal of Accommodation), elevated crude oil (> $90), sticky food/headline CPI > 5.5%, prioritizing balance-sheet deleveraging and high RoCE.',
    weights: { fin: 0.40, grw: 0.15, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  bull_growth: {
    key: 'bull_growth',
    label: 'High Growth / Low Rate Bull',
    templateLabel: 'Bull Growth',
    description: 'Accommodative liquidity conditions rewarding accelerating revenue growth and expanding TAM.',
    indiaDescription: 'Robust domestic capex cycle, record GST collections, Manufacturing PMI > 56, accommodative liquidity, and relentless DII Mutual Fund SIP inflows.',
    weights: { fin: 0.20, grw: 0.35, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  stagflation: {
    key: 'stagflation',
    label: 'Recessionary / Stagflation',
    templateLabel: 'Stagflation/Recession',
    description: 'Defensive capital preservation prioritizing liquidity coverage and peer valuation margin of safety.',
    indiaDescription: 'Global trade headwinds, FII risk-off selling, INR currency volatility, import cost shocks, favoring high-governance and low-debt franchises.',
    weights: { fin: 0.45, grw: 0.10, val: 0.25, sen: 0.10, rsk: 0.10 },
  },
};

export interface QRCESimulatorInput {
  ticker: string;
  companyName: string;
  jurisdiction: MarketJurisdiction;
  regime: MacroRegimeKey;
  scores: {
    fin: number;
    grw: number;
    val: number;
    sen: number;
    rsk: number;
  };
  hardData: {
    xbrlDivergencePenalty: boolean; // -20 (US: 10-Q/10-K XBRL vs Transcripts; India: BSE/NSE LODR Reg 33 & Ind AS 7 FCF/Debtors divergence)
    consensusModifier: 'none' | 'beat_gt_5' | 'miss_gt_3'; // 0 | +10 | -15
  };
  altData: {
    insiderStatus:
      | 'neutral'
      | 'divergence_sell_5m'
      | 'alignment_buy_500k'
      | 'promoter_buy_25cr'
      | 'promoter_sell_50cr'; // 0 | -15 | +10 | +10 | -15
    promoterPledgeHigh: boolean; // -15 (India specific: Promoter pledged shares > 20% or rising pledge)
    shortInterestHigh: boolean; // -10 (US: SI > 15% & DTC > 6; India: F&O Ban / MWPL > 95% or heavy short buildup)
    optionsFlow:
      | 'neutral'
      | 'bearish_pcr_gt_1_5'
      | 'bullish_pcr_lt_0_6_darkpool'
      | 'fii_dii_delivery_bullish'
      | 'fii_heavy_outflow_bearish'; // 0 | -5 | +10 | +10 | -5
  };
  macroFilter:
    | 'none'
    | 'cyclical_downside'
    | 'defensive_bonus'
    | 'rbi_hawkish_crude_shock'
    | 'india_capex_boom'; // 0 | -10 | +10 | -10 | +10
  drivers: {
    bullFactor: string;
    bearFactor: string;
    insiderSignal: string;
    criticalCatalyst: string;
  };
}

export interface QRCEComputedResult {
  weightedContributions: {
    fin: number;
    grw: number;
    val: number;
    sen: number;
    rsk: number;
  };
  weightedBaseSum: number;
  deltaHardData: number;
  deltaInsider: number;
  deltaPledge: number;
  deltaOptions: number;
  deltaAltTotal: number;
  deltaMacro: number;
  rawCqs: number;
  clampedCqs: number;
  rating: RatingLabel;
  confidence: number;
  stance: 'Accumulate' | 'Hold' | 'Reduce' | 'Exit';
  horizon: string;
  operationalAction: string;
  terminalOutput: string;
}

export function calculateQRCE(
  input: QRCESimulatorInput,
  timestampStr = '2026-10-23 16:00 UTC'
): QRCEComputedResult {
  const regimeDef = MACRO_REGIMES[input.regime];
  const { weights } = regimeDef;
  const isIndia = input.jurisdiction === 'india_nse_bse';

  const cFin = weights.fin * input.scores.fin;
  const cGrw = weights.grw * input.scores.grw;
  const cVal = weights.val * input.scores.val;
  const cSen = weights.sen * input.scores.sen;
  const cRsk = weights.rsk * input.scores.rsk;

  const weightedBaseSum = cFin + cGrw + cVal + cSen + cRsk;

  let deltaHardData = 0;
  if (input.hardData.xbrlDivergencePenalty) deltaHardData -= 20;
  if (input.hardData.consensusModifier === 'beat_gt_5') deltaHardData += 10;
  if (input.hardData.consensusModifier === 'miss_gt_3') deltaHardData -= 15;

  let deltaInsider = 0;
  if (
    input.altData.insiderStatus === 'divergence_sell_5m' ||
    input.altData.insiderStatus === 'promoter_sell_50cr'
  ) {
    deltaInsider -= 15;
  }
  if (
    input.altData.insiderStatus === 'alignment_buy_500k' ||
    input.altData.insiderStatus === 'promoter_buy_25cr'
  ) {
    deltaInsider += 10;
  }

  const deltaPledge = isIndia && input.altData.promoterPledgeHigh ? -15 : 0;

  let deltaOptions = 0;
  if (input.altData.shortInterestHigh) deltaOptions -= 10;
  if (
    input.altData.optionsFlow === 'bearish_pcr_gt_1_5' ||
    input.altData.optionsFlow === 'fii_heavy_outflow_bearish'
  ) {
    deltaOptions -= 5;
  }
  if (
    input.altData.optionsFlow === 'bullish_pcr_lt_0_6_darkpool' ||
    input.altData.optionsFlow === 'fii_dii_delivery_bullish'
  ) {
    deltaOptions += 10;
  }

  const deltaAltTotal = deltaInsider + deltaPledge + deltaOptions;

  let deltaMacro = 0;
  if (
    input.macroFilter === 'cyclical_downside' ||
    input.macroFilter === 'rbi_hawkish_crude_shock'
  ) {
    deltaMacro -= 10;
  }
  if (
    input.macroFilter === 'defensive_bonus' ||
    input.macroFilter === 'india_capex_boom'
  ) {
    deltaMacro += 10;
  }

  const rawCqs = weightedBaseSum + deltaHardData + deltaAltTotal + deltaMacro;
  const clampedCqs = Math.max(-100, Math.min(100, Number(rawCqs.toFixed(1))));

  let rating: RatingLabel = 'HOLD';
  let stance: 'Accumulate' | 'Hold' | 'Reduce' | 'Exit' = 'Hold';
  let horizon = 'Neutral (Rebalance)';
  let operationalAction = 'Maintain current exposure / Portfolio rebalance';
  let confidence = 68;

  if (clampedCqs >= 65) {
    rating = 'STRONG BUY';
    stance = 'Accumulate';
    horizon = '6–12 Months';
    operationalAction = 'High-conviction capital allocation / Aggressive accumulation';
    confidence = Math.min(98, Math.round(85 + ((clampedCqs - 65) / 35) * 12));
  } else if (clampedCqs >= 20) {
    rating = 'BUY';
    stance = 'Accumulate';
    horizon = '6–12 Months';
    operationalAction = 'Standard long entry / Phased accumulation';
    confidence = Math.min(88, Math.round(70 + ((clampedCqs - 20) / 44) * 15));
  } else if (clampedCqs <= -65) {
    rating = 'STRONG SELL';
    stance = 'Exit';
    horizon = 'Immediate';
    operationalAction = 'Liquidation of exposure / Tactical short bias';
    confidence = Math.min(98, Math.round(85 + ((Math.abs(clampedCqs) - 65) / 35) * 12));
  } else if (clampedCqs <= -20) {
    rating = 'SELL';
    stance = 'Reduce';
    horizon = '3–6 Months';
    operationalAction = 'De-risk / Systematic reduction of long exposure';
    confidence = Math.min(88, Math.round(70 + ((Math.abs(clampedCqs) - 20) / 44) * 15));
  } else {
    rating = 'HOLD';
    stance = 'Hold';
    horizon = 'Neutral';
    operationalAction = 'Maintain current exposure / Portfolio rebalance';
    confidence = Math.round(60 + (1 - Math.abs(clampedCqs) / 20) * 14);
  }

  const fmtSigned = (n: number, decimals = 1) => {
    const fixed = n.toFixed(decimals);
    return n > 0 ? `+${fixed}` : fixed;
  };
  const fmtIntSigned = (n: number) => (n > 0 ? `+${n}` : `${n}`);

  const w1Pct = Math.round(weights.fin * 100);
  const w2Pct = Math.round(weights.grw * 100);
  const w3Pct = Math.round(weights.val * 100);
  const w4Pct = Math.round(weights.sen * 100);
  const w5Pct = Math.round(weights.rsk * 100);

  const marketHeader = isIndia
    ? 'JURISDICTION   : INDIA (NSE & BSE / SEBI LODR REG 33 & PIT REG 7)'
    : 'JURISDICTION   : US & GLOBAL (SEC EDGAR / NYSE / NASDAQ / FORM 4)';

  const hardDataLabel = isIndia
    ? '- BSE/NSE LODR Reg 33 & Ind AS 7 Check'
    : '- SEC EDGAR / Consensus Verification';

  const insiderLabel = isIndia
    ? '- SEBI PIT Reg 7(2) Promoter Action '
    : '- Form 4 Insider Trading Alignment  ';

  const pledgeLine = isIndia
    ? `\n- Promoter Share Pledge Risk (>20%)   : ${fmtIntSigned(deltaPledge)} Points`
    : '';

  const optionsLabel = isIndia
    ? '- NSE F&O, MWPL & FII/DII Delivery   '
    : '- Short Interest / Options Sentiment ';

  const macroLabel = isIndia
    ? '- RBI MPC & India Macro Normalization'
    : '- Macro & Sector Normalization      ';

  const terminalOutput = [
    '================================================================================',
    '                        QUANTITATIVE ANALYSIS ENGINE                            ',
    '================================================================================',
    `AUTHOR          : Sparsh Keshwani`,
    `TICKER / NAME   : ${input.ticker.toUpperCase()} / ${input.companyName}`,
    marketHeader,
    `MACRO REGIME    : ${regimeDef.templateLabel}`,
    `TIMESTAMP       : ${timestampStr}`,
    '--------------------------------------------------------------------------------',
    '',
    `FINAL RATING    : ${rating}`,
    `COMPOSITE QUANT SCORE (CQS) : ${fmtSigned(clampedCqs)} / +100`,
    `CONFIDENCE SCORE           : ${confidence}%`,
    '',
    '--------------------------------------------------------------------------------',
    'FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)',
    '--------------------------------------------------------------------------------',
    `[1] Financial Health (${w1Pct}%) : Score = ${fmtIntSigned(input.scores.fin).padStart(4, ' ')} | Contribution = ${fmtSigned(cFin)}`,
    `[2] Growth Momentum  (${w2Pct}%) : Score = ${fmtIntSigned(input.scores.grw).padStart(4, ' ')} | Contribution = ${fmtSigned(cGrw)}`,
    `[3] Valuation (Peer) (${w3Pct}%) : Score = ${fmtIntSigned(input.scores.val).padStart(4, ' ')} | Contribution = ${fmtSigned(cVal)}`,
    `[4] Sentiment        (${w4Pct}%) : Score = ${fmtIntSigned(input.scores.sen).padStart(4, ' ')} | Contribution = ${fmtSigned(cSen)}`,
    `[5] Risk Profile     (${w5Pct}%) : Score = ${fmtIntSigned(input.scores.rsk).padStart(4, ' ')} | Contribution = ${fmtSigned(cRsk)}`,
    '--------------------------------------------------------------------------------',
    '',
    'HARD DATA & ALT-DATA ADJUSTMENTS',
    '--------------------------------------------------------------------------------',
    `${hardDataLabel} : ${fmtIntSigned(deltaHardData)} Points`,
    `${insiderLabel} : ${fmtIntSigned(deltaInsider)} Points${pledgeLine}`,
    `${optionsLabel} : ${fmtIntSigned(deltaOptions)} Points`,
    `${macroLabel} : ${fmtIntSigned(deltaMacro)} Points`,
    '--------------------------------------------------------------------------------',
    '',
    'QUANTITATIVE JUSTIFICATION & KEY DRIVERS:',
    `- Primary Bull Factor : ${input.drivers.bullFactor}`,
    `- Primary Bear Factor : ${input.drivers.bearFactor}`,
    `- Form 4 / SEBI PIT Signal : ${input.drivers.insiderSignal}`,
    `- Critical Catalyst   : ${input.drivers.criticalCatalyst}`,
    '',
    'RECOMMENDED ACTIONABLE THRESHOLD:',
    `- Stance     : ${stance}`,
    `- Horizon    : ${horizon}`,
    '================================================================================',
  ].join('\n');

  return {
    weightedContributions: {
      fin: Number(cFin.toFixed(2)),
      grw: Number(cGrw.toFixed(2)),
      val: Number(cVal.toFixed(2)),
      sen: Number(cSen.toFixed(2)),
      rsk: Number(cRsk.toFixed(2)),
    },
    weightedBaseSum: Number(weightedBaseSum.toFixed(2)),
    deltaHardData,
    deltaInsider,
    deltaPledge,
    deltaOptions,
    deltaAltTotal,
    deltaMacro,
    rawCqs: Number(rawCqs.toFixed(2)),
    clampedCqs,
    rating,
    confidence,
    stance,
    horizon,
    operationalAction,
    terminalOutput,
  };
}

export interface PresetScenario {
  id: string;
  jurisdiction: MarketJurisdiction;
  label: string;
  summary: string;
  sampleUserPrompt: string;
  input: QRCESimulatorInput;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  // US & Global Equities
  {
    id: 'nvda-bull',
    jurisdiction: 'us_global',
    label: 'NVDA · Bull Growth (US)',
    summary: 'Data-center compute expansion with +8.4% revenue beat and dark-pool institutional accumulation.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on NVIDIA Corp (NVDA) under the Bull Growth regime. Q3 10-Q XBRL confirms 55.8% net margin, $16.8B FCF, Debt/Equity 0.18, and YoY revenue growth of +94% (+8.4% beat vs. consensus) with raised Q4 guidance. Trading at 34x forward P/E vs. Semis peer median 31x (PEG 1.1x). 6 analyst upgrades in 30 days; Put/Call ratio 0.52 with heavy dark pool institutional inflows; routine 10b5-1 sales under $5M threshold.',
    input: {
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      jurisdiction: 'us_global',
      regime: 'bull_growth',
      scores: { fin: 92, grw: 95, val: 15, sen: 82, rsk: 70 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'beat_gt_5',
      },
      altData: {
        insiderStatus: 'neutral',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'bullish_pcr_lt_0_6_darkpool',
      },
      macroFilter: 'none',
      drivers: {
        bullFactor: '55.8% GAAP net margin with +94% YoY revenue acceleration and +8.4% consensus beat',
        bearFactor: 'Hyperscaler capex concentration across top-4 cloud customers',
        insiderSignal: 'Pre-scheduled 10b5-1 dispositions below $5M 90-day divergence threshold',
        criticalCatalyst: 'Blackwell rack-scale volume shipments and raised full-year gross margin guidance',
      },
    },
  },
  {
    id: 'intc-divergence',
    jurisdiction: 'us_global',
    label: 'INTC · XBRL Divergence (US)',
    summary: 'Management turnaround narrative penalized by negative XBRL Free Cash Flow (-20) and EPS miss (-15).',
    sampleUserPrompt:
      'Evaluate Intel Corp (INTC) in a High Rate/Inflation regime. Earnings call emphasized "strong operational profitability inflection", but 10-Q XBRL filing shows -$3.1B trailing Free Cash Flow and EPS missed consensus by -6.2%. Revenue contracted -6% YoY with lowered foundry margin guidance. P/FCF negative, EV/EBITDA near sector median. Put/Call ratio spiked to 1.68 following 4 analyst downgrades.',
    input: {
      ticker: 'INTC',
      companyName: 'Intel Corporation',
      jurisdiction: 'us_global',
      regime: 'high_rate',
      scores: { fin: -45, grw: -40, val: 10, sen: -55, rsk: -25 },
      hardData: {
        xbrlDivergencePenalty: true,
        consensusModifier: 'miss_gt_3',
      },
      altData: {
        insiderStatus: 'neutral',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'bearish_pcr_gt_1_5',
      },
      macroFilter: 'none',
      drivers: {
        bullFactor: 'Tangible book value floor and CHIPS Act capital grant disbursements',
        bearFactor: '10-Q XBRL negative FCF (-$3.1B) contradicts management profitability narrative (-20 pt penalty)',
        insiderSignal: 'No C-suite open-market purchases above $500k threshold over trailing 90 days',
        criticalCatalyst: '18A process node external foundry customer tape-out milestones',
      },
    },
  },
  {
    id: 'unh-defensive',
    jurisdiction: 'us_global',
    label: 'UNH · High-Rate Defensive (US)',
    summary: 'Cash-generative healthcare compounder earning +10 Defensive Bonus and +10 CEO Form 4 buy alignment.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on UnitedHealth Group (UNH) under High Interest Rate / Inflation regime. 10-K/10-Q XBRL shows 8.4% FCF yield, 11.2x interest coverage, +9% YoY revenue growth in line with raised Optum guidance. P/E at 18.2x (22nd percentile of Managed Care peers). Form 4 shows $1.2M open-market share purchase by CFO last month; defensive Healthcare cash-rich profile applies.',
    input: {
      ticker: 'UNH',
      companyName: 'UnitedHealth Group Inc.',
      jurisdiction: 'us_global',
      regime: 'high_rate',
      scores: { fin: 68, grw: 35, val: 52, sen: 20, rsk: 45 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'none',
      },
      altData: {
        insiderStatus: 'alignment_buy_500k',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'neutral',
      },
      macroFilter: 'defensive_bonus',
      drivers: {
        bullFactor: '8.4% FCF yield and 11.2x interest coverage weighted at 40% under High-Rate regime',
        bearFactor: 'Medicare Advantage medical care ratio (MCR) utilization pressure',
        insiderSignal: 'Verified Form 4 open-market purchase >$500k ($1.2M CFO buy, +10 pt bonus)',
        criticalCatalyst: 'CMS final Medicare Advantage rate notice and Optum Rx margin expansion',
      },
    },
  },

  // Indian Stock Market (NSE / BSE / SEBI)
  {
    id: 'reliance-nse',
    jurisdiction: 'india_nse_bse',
    label: 'RELIANCE.NS · Capex & Retail Inflection (India)',
    summary: 'India conglomerate with Retail/Jio FCF inflection, steady O2C margins, zero promoter pledge, and strong DII inflows.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on Reliance Industries Ltd (RELIANCE.NS) on NSE under Capex Expansion Bull regime. BSE/NSE LODR Reg 33 filing confirms consolidated EBITDA of ₹44,500 Cr (+11.8% YoY), quarterly PAT ₹19,800 Cr (+6.2% beat vs consensus), and Ind AS 7 cash flows show Free Cash Flow turning positive post 5G capex. Promoter holding rock-solid at 50.3% with 0.0% pledge. FII + DII mutual fund delivery buying >62% on NSE.',
    input: {
      ticker: 'RELIANCE.NS',
      companyName: 'Reliance Industries Limited',
      jurisdiction: 'india_nse_bse',
      regime: 'bull_growth',
      scores: { fin: 75, grw: 82, val: 28, sen: 78, rsk: 85 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'beat_gt_5',
      },
      altData: {
        insiderStatus: 'neutral',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'fii_dii_delivery_bullish',
      },
      macroFilter: 'india_capex_boom',
      drivers: {
        bullFactor: 'Jio 5G and Reliance Retail FCF inflection with +11.8% EBITDA growth and 0.0% promoter pledge',
        bearFactor: 'O2C refining margin volatility tied to global Russian crude spreads',
        insiderSignal: 'Promoter family holding stable at 50.3% with zero shares pledged (SEBI PIT Reg 7 clean)',
        criticalCatalyst: 'Potential value-unlocking IPO filing for Reliance Retail and Jio Infocomm',
      },
    },
  },
  {
    id: 'hdfcbank-nse',
    jurisdiction: 'india_nse_bse',
    label: 'HDFCBANK.NS · Banking Defensive (India)',
    summary: 'Post-merger deposit surge, GNPA at 1.24%, DII domestic SIPs absorbing FII selling, and High-Rate Defensive Bonus.',
    sampleUserPrompt:
      'Evaluate HDFC Bank Ltd (HDFCBANK.NS) on NSE in a High Interest Rate / RBI Hawkish regime. SEBI LODR Reg 33 quarterly results report Net Profit of ₹16,820 Cr (+33% YoY post-amalgamation), Gross NPA of 1.24% with 74% Provision Coverage Ratio (PCR). Net Interest Margin stabilizing at 3.45%. DII mutual funds absorbing foreign institutional supply. High-Rate Banking defensive profile applies.',
    input: {
      ticker: 'HDFCBANK.NS',
      companyName: 'HDFC Bank Limited',
      jurisdiction: 'india_nse_bse',
      regime: 'high_rate',
      scores: { fin: 74, grw: 42, val: 56, sen: 20, rsk: 78 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'beat_gt_5',
      },
      altData: {
        insiderStatus: 'neutral',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'fii_dii_delivery_bullish',
      },
      macroFilter: 'defensive_bonus',
      drivers: {
        bullFactor: 'Top-tier balance sheet with 1.24% Gross NPA, 74% PCR, and domestic retail deposit dominance',
        bearFactor: 'Post-merger Credit-Deposit (CD) ratio adjustment and mortgage integration transition',
        insiderSignal: 'Widely held institutional structure with no promoter pledge or insider dump',
        criticalCatalyst: 'Deposit growth outpacing credit expansion to normalize CD ratio toward 85%',
      },
    },
  },
  {
    id: 'infy-nse',
    jurisdiction: 'india_nse_bse',
    label: 'INFY.NS · IT Export Squeeze (India)',
    summary: 'Western enterprise IT budget caution, flat guidance, offset by pristine zero-debt balance sheet and 85% FCF return.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on Infosys Ltd (INFY.NS) under High Rate regime. Concall reported soft discretionary IT demand in US/Europe with constant-currency revenue guidance trimmed to 3-4%. However, BSE/NSE LODR Reg 33 reports operating margin of 21.1%, zero long-term debt, and 85% FCF return via dividends and buybacks. SEBI PIT filings show routine ESOP exercises.',
    input: {
      ticker: 'INFY.NS',
      companyName: 'Infosys Limited',
      jurisdiction: 'india_nse_bse',
      regime: 'high_rate',
      scores: { fin: 86, grw: -8, val: 18, sen: -12, rsk: 88 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'none',
      },
      altData: {
        insiderStatus: 'neutral',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'neutral',
      },
      macroFilter: 'none',
      drivers: {
        bullFactor: '21.1% operating margin resilience, zero debt, and >85% free cash flow returned to shareholders',
        bearFactor: 'Western BFSI and Telecom clients delaying discretionary cloud and consulting spend',
        insiderSignal: 'No adverse promoter selling; clean SEBI PIT Reg 7 disclosures',
        criticalCatalyst: 'Large mega-deal ramp-ups (Turing generative AI platform adoptions) in H2',
      },
    },
  },
  {
    id: 'tatamotors-nse',
    jurisdiction: 'india_nse_bse',
    label: 'TATAMOTORS.NS · EV Turnaround (India)',
    summary: 'JLR positive FCF generation, India EV dominance (>70% share), and net automotive debt zero trajectory.',
    sampleUserPrompt:
      'Audit Tata Motors Ltd (TATAMOTORS.NS) on NSE under Capex Expansion Bull regime. Ind AS 7 statements confirm JLR Free Cash Flow of £2.3B, India Passenger Vehicle EV market share holding >70%, and consolidated net debt trending toward zero. Quarterly PAT beat consensus by +8.4%. Delivery percentage on NSE exceeds 64%.',
    input: {
      ticker: 'TATAMOTORS.NS',
      companyName: 'Tata Motors Limited',
      jurisdiction: 'india_nse_bse',
      regime: 'bull_growth',
      scores: { fin: 68, grw: 86, val: 40, sen: 72, rsk: 65 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'beat_gt_5',
      },
      altData: {
        insiderStatus: 'promoter_buy_25cr',
        promoterPledgeHigh: false,
        shortInterestHigh: false,
        optionsFlow: 'fii_dii_delivery_bullish',
      },
      macroFilter: 'india_capex_boom',
      drivers: {
        bullFactor: 'Jio-speed EV market share (>70%) in India coupled with JLR £2.3B free cash flow turnaround',
        bearFactor: 'European EV subsidy rollbacks and potential UK supply chain friction',
        insiderSignal: 'Tata Sons promoter creep buying > ₹25 Cr via open market (+10 alignment bonus)',
        criticalCatalyst: 'Planned demerger into two separate listed entities (Commercial Vehicles & PV/EV)',
      },
    },
  },
  {
    id: 'distress-midcap-in',
    jurisdiction: 'india_nse_bse',
    label: 'MIDCAP-DISTRESS · High Pledge & LODR Alert (India)',
    summary: 'Aggressive orderbook claims contradicted by negative Free Cash Flow, 42% promoter pledge, and promoter block dump.',
    sampleUserPrompt:
      'Perform QRCE v3.0.0 governance audit on a speculative infrastructure midcap on BSE. Concall boasted record ₹5,000 Cr orderbook, but BSE LODR Reg 33 filing shows negative Ind AS 7 Operating Cash Flow for 4 quarters, Trade Debtors expanded +45% YoY vs +6% revenue. Shareholding pattern shows 42% of promoter shares pledged to NBFCs, and promoter sold ₹65 Cr in open market blocks.',
    input: {
      ticker: 'INFRA-SPEC.BO',
      companyName: 'Speculative Infra & EPC Ltd',
      jurisdiction: 'india_nse_bse',
      regime: 'stagflation',
      scores: { fin: -70, grw: -15, val: -5, sen: -60, rsk: -85 },
      hardData: {
        xbrlDivergencePenalty: true,
        consensusModifier: 'miss_gt_3',
      },
      altData: {
        insiderStatus: 'promoter_sell_50cr',
        promoterPledgeHigh: true,
        shortInterestHigh: true,
        optionsFlow: 'fii_heavy_outflow_bearish',
      },
      macroFilter: 'rbi_hawkish_crude_shock',
      drivers: {
        bullFactor: 'Nominal EPC orderbook backlog on state government infrastructure tenders',
        bearFactor: 'Negative Ind AS FCF, trade debtors surge >45%, and 42% promoter share pledge invoking margin call risk',
        insiderSignal: 'Promoter dumping ₹65 Cr in open market blocks (-15) + High Pledge (-15)',
        criticalCatalyst: 'Imminent lender debt maturity wall and potential invocation of pledged shares by NBFCs',
      },
    },
  },
];
