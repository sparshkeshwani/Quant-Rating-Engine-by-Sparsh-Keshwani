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

export interface RegimeDefinition {
  key: MacroRegimeKey;
  label: string;
  templateLabel: string;
  description: string;
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
    weights: { fin: 0.30, grw: 0.25, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  high_rate: {
    key: 'high_rate',
    label: 'High Interest Rate / Inflation',
    templateLabel: 'High Rate/Inflation',
    description: 'Restrictive monetary policy prioritizing balance-sheet solvency and free cash flow yield.',
    weights: { fin: 0.40, grw: 0.15, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  bull_growth: {
    key: 'bull_growth',
    label: 'High Growth / Low Rate Bull',
    templateLabel: 'Bull Growth',
    description: 'Accommodative liquidity conditions rewarding accelerating revenue growth and expanding TAM.',
    weights: { fin: 0.20, grw: 0.35, val: 0.20, sen: 0.15, rsk: 0.10 },
  },
  stagflation: {
    key: 'stagflation',
    label: 'Recessionary / Stagflation',
    templateLabel: 'Stagflation/Recession',
    description: 'Defensive capital preservation prioritizing liquidity coverage and peer valuation margin of safety.',
    weights: { fin: 0.45, grw: 0.10, val: 0.25, sen: 0.10, rsk: 0.10 },
  },
};

export interface QRCESimulatorInput {
  ticker: string;
  companyName: string;
  regime: MacroRegimeKey;
  scores: {
    fin: number;
    grw: number;
    val: number;
    sen: number;
    rsk: number;
  };
  hardData: {
    xbrlDivergencePenalty: boolean; // -20
    consensusModifier: 'none' | 'beat_gt_5' | 'miss_gt_3'; // 0 | +10 | -15
  };
  altData: {
    insiderStatus: 'neutral' | 'divergence_sell_5m' | 'alignment_buy_500k'; // 0 | -15 | +10
    shortInterestHigh: boolean; // -10 (SI > 15% & DTC > 6)
    optionsFlow: 'neutral' | 'bearish_pcr_gt_1_5' | 'bullish_pcr_lt_0_6_darkpool'; // 0 | -5 | +10
  };
  macroFilter: 'none' | 'cyclical_downside' | 'defensive_bonus'; // 0 | -10 | +10
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

export function calculateQRCE(input: QRCESimulatorInput, timestampStr = '2026-10-23 16:00 UTC'): QRCEComputedResult {
  const regimeDef = MACRO_REGIMES[input.regime];
  const { weights } = regimeDef;

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
  if (input.altData.insiderStatus === 'divergence_sell_5m') deltaInsider -= 15;
  if (input.altData.insiderStatus === 'alignment_buy_500k') deltaInsider += 10;

  let deltaOptions = 0;
  if (input.altData.shortInterestHigh) deltaOptions -= 10;
  if (input.altData.optionsFlow === 'bearish_pcr_gt_1_5') deltaOptions -= 5;
  if (input.altData.optionsFlow === 'bullish_pcr_lt_0_6_darkpool') deltaOptions += 10;

  const deltaAltTotal = deltaInsider + deltaOptions;

  let deltaMacro = 0;
  if (input.macroFilter === 'cyclical_downside') deltaMacro -= 10;
  if (input.macroFilter === 'defensive_bonus') deltaMacro += 10;

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

  const terminalOutput = [
    '================================================================================',
    '                        QUANTITATIVE ANALYSIS ENGINE                            ',
    '================================================================================',
    `AUTHOR          : Sparsh Keshwani`,
    `TICKER / NAME   : ${input.ticker.toUpperCase()} / ${input.companyName}`,
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
    `- SEC EDGAR / Consensus Verification : ${fmtIntSigned(deltaHardData)} Points`,
    `- Form 4 Insider Trading Alignment   : ${fmtIntSigned(deltaInsider)} Points`,
    `- Short Interest / Options Sentiment : ${fmtIntSigned(deltaOptions)} Points`,
    `- Macro & Sector Normalization       : ${fmtIntSigned(deltaMacro)} Points`,
    '--------------------------------------------------------------------------------',
    '',
    'QUANTITATIVE JUSTIFICATION & KEY DRIVERS:',
    `- Primary Bull Factor : ${input.drivers.bullFactor}`,
    `- Primary Bear Factor : ${input.drivers.bearFactor}`,
    `- Form 4 & Insider Signal : ${input.drivers.insiderSignal}`,
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
  label: string;
  summary: string;
  sampleUserPrompt: string;
  input: QRCESimulatorInput;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'nvda-bull',
    label: 'NVDA · Bull Growth Regime',
    summary: 'Data-center compute expansion with +8.4% revenue beat and dark-pool institutional accumulation.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on NVIDIA Corp (NVDA) under the Bull Growth regime. Q3 10-Q XBRL confirms 55.8% net margin, $16.8B FCF, Debt/Equity 0.18, and YoY revenue growth of +94% (+8.4% beat vs. consensus) with raised Q4 guidance. Trading at 34x forward P/E vs. Semis peer median 31x (PEG 1.1x). 6 analyst upgrades in 30 days; Put/Call ratio 0.52 with heavy dark pool institutional inflows; routine 10b5-1 sales under $5M threshold.',
    input: {
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      regime: 'bull_growth',
      scores: { fin: 92, grw: 95, val: 15, sen: 82, rsk: 70 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'beat_gt_5',
      },
      altData: {
        insiderStatus: 'neutral',
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
    label: 'INTC · XBRL Divergence Case',
    summary: 'Management turnaround narrative penalized by negative XBRL Free Cash Flow (-20) and EPS miss (-15).',
    sampleUserPrompt:
      'Evaluate Intel Corp (INTC) in a High Rate/Inflation regime. Earnings call emphasized "strong operational profitability inflection", but 10-Q XBRL filing shows -$3.1B trailing Free Cash Flow and EPS missed consensus by -6.2%. Revenue contracted -6% YoY with lowered foundry margin guidance. P/FCF negative, EV/EBITDA near sector median. Put/Call ratio spiked to 1.68 following 4 analyst downgrades.',
    input: {
      ticker: 'INTC',
      companyName: 'Intel Corporation',
      regime: 'high_rate',
      scores: { fin: -45, grw: -40, val: 10, sen: -55, rsk: -25 },
      hardData: {
        xbrlDivergencePenalty: true,
        consensusModifier: 'miss_gt_3',
      },
      altData: {
        insiderStatus: 'neutral',
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
    label: 'UNH · High-Rate Defensive',
    summary: 'Cash-generative healthcare compounder earning +10 Defensive Bonus and +10 CEO Form 4 buy alignment.',
    sampleUserPrompt:
      'Run QRCE v3.0.0 on UnitedHealth Group (UNH) under High Interest Rate / Inflation regime. 10-K/10-Q XBRL shows 8.4% FCF yield, 11.2x interest coverage, +9% YoY revenue growth in line with raised Optum guidance. P/E at 18.2x (22nd percentile of Managed Care peers). Form 4 shows $1.2M open-market share purchase by CFO last month; defensive Healthcare cash-rich profile applies.',
    input: {
      ticker: 'UNH',
      companyName: 'UnitedHealth Group Inc.',
      regime: 'high_rate',
      scores: { fin: 68, grw: 35, val: 52, sen: 20, rsk: 45 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'none',
      },
      altData: {
        insiderStatus: 'alignment_buy_500k',
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
  {
    id: 'cat-cyclical',
    label: 'CAT · Stagflation Cyclical Test',
    summary: 'Strong balance sheet offset by Contracting PMI (<48) Cyclical Downside Penalty (-10) into HOLD.',
    sampleUserPrompt:
      'Analyze Caterpillar Inc. (CAT) under Stagflation/Recession regime (ISM PMI at 46.8, inverted curve). XBRL margins healthy at 16.5% with solid FCF, but dealer backlog growth decelerated to +1% YoY with flat guidance. Trading near Industrial peer median multiples (EV/EBITDA 13.4x). C-suite Form 4 net selling was $6.4M over 90 days despite upbeat commentary.',
    input: {
      ticker: 'CAT',
      companyName: 'Caterpillar Inc.',
      regime: 'stagflation',
      scores: { fin: 55, grw: 5, val: 0, sen: 10, rsk: 40 },
      hardData: {
        xbrlDivergencePenalty: false,
        consensusModifier: 'none',
      },
      altData: {
        insiderStatus: 'divergence_sell_5m',
        shortInterestHigh: false,
        optionsFlow: 'neutral',
      },
      macroFilter: 'cyclical_downside',
      drivers: {
        bullFactor: '16.5% operating margin resilience and disciplined share repurchase cadence',
        bearFactor: 'Contracting PMI (<48) triggers -10 pt Industrial cyclical penalty alongside $6.4M Form 4 selling',
        insiderSignal: 'C-Suite net insider selling of $6.4M (> $5M 90-day limit, -15 pt divergence penalty)',
        criticalCatalyst: 'North American non-residential construction backlog and mining capex orders',
      },
    },
  },
];
