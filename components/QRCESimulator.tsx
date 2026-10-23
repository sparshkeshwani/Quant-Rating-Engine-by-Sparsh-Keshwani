'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Zap } from 'lucide-react';
import {
  MACRO_REGIMES,
  MacroRegimeKey,
  MarketJurisdiction,
  PRESET_SCENARIOS,
  QRCESimulatorInput,
  RatingLabel,
  calculateQRCE,
} from '@/lib/qrce-engine';
import { LiveStockData } from './RealtimeStockService';

interface QRCESimulatorProps {
  externalStock?: LiveStockData | null;
}

const RATING_SPECTRUM: Array<{
  label: RatingLabel;
  range: string;
  activeClass: string;
}> = [
  {
    label: 'STRONG SELL',
    range: '-100 to -65',
    activeClass: 'border-red-700 bg-red-700 text-white',
  },
  {
    label: 'SELL',
    range: '-64 to -20',
    activeClass: 'border-red-600 bg-red-50 text-red-900',
  },
  {
    label: 'HOLD',
    range: '-19 to +19',
    activeClass: 'border-slate-700 bg-slate-800 text-white',
  },
  {
    label: 'BUY',
    range: '+20 to +64',
    activeClass: 'border-emerald-600 bg-emerald-50 text-emerald-900',
  },
  {
    label: 'STRONG BUY',
    range: '+65 to +100',
    activeClass: 'border-emerald-700 bg-emerald-700 text-white',
  },
];

export default function QRCESimulator({ externalStock }: QRCESimulatorProps = {}) {
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<MarketJurisdiction>(() => externalStock?.jurisdiction ?? 'india_nse_bse');
  const [activePresetId, setActivePresetId] = useState<string>(() =>
    externalStock ? 'live-custom' : 'reliance-nse'
  );
  const [liveStockInfo] = useState<LiveStockData | null>(() => externalStock ?? null);
  const [simState, setSimState] = useState<QRCESimulatorInput>(() => {
    if (externalStock) {
      return {
        ticker: externalStock.symbol,
        companyName: externalStock.companyName,
        jurisdiction: externalStock.jurisdiction,
        regime: 'baseline',
        scores: {
          fin: externalStock.suggestedFactorScores.fin,
          grw: externalStock.suggestedFactorScores.grw,
          val: externalStock.suggestedFactorScores.val,
          sen: externalStock.suggestedFactorScores.sen,
          rsk: externalStock.suggestedFactorScores.rsk,
        },
        hardData: {
          xbrlDivergencePenalty: false,
          consensusModifier: 'none',
        },
        altData: {
          insiderStatus: 'neutral',
          promoterPledgeHigh: false,
          shortInterestHigh: false,
          optionsFlow:
            externalStock.volume > externalStock.averageVolume * 1.25
              ? externalStock.jurisdiction === 'india_nse_bse'
                ? 'fii_dii_delivery_bullish'
                : 'bullish_pcr_lt_0_6_darkpool'
              : 'neutral',
        },
        macroFilter: 'none',
        drivers: {
          bullFactor: `Live market price ${externalStock.currency === 'INR' ? '₹' : '$'}${externalStock.price} (${externalStock.exchange}) trading at ${externalStock.position52WeekPct.toFixed(1)}% of 52-week high.`,
          bearFactor: `Recent 1-month trajectory: ${externalStock.monthReturnPct >= 0 ? '+' : ''}${externalStock.monthReturnPct.toFixed(2)}%.`,
          insiderSignal:
            externalStock.jurisdiction === 'india_nse_bse'
              ? 'SEBI PIT promoter disclosures neutral; verify quarterly shareholding pledge.'
              : 'SEC Form 4 disclosures neutral; no recent major executive dispositions.',
          criticalCatalyst: 'Awaiting next quarterly earnings concall and audited cash flow report.',
        },
      };
    }
    const rel = PRESET_SCENARIOS.find((p) => p.id === 'reliance-nse');
    return rel ? rel.input : PRESET_SCENARIOS[0].input;
  });
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [copiedTestPrompt, setCopiedTestPrompt] = useState<boolean>(false);

  const isIndia = simState.jurisdiction === 'india_nse_bse';

  const visiblePresets = useMemo(() => {
    return PRESET_SCENARIOS.filter(
      (p) => p.jurisdiction === selectedJurisdiction
    );
  }, [selectedJurisdiction]);

  const activePreset = useMemo(() => {
    if (activePresetId === 'live-custom' && liveStockInfo) {
      return {
        id: 'live-custom',
        jurisdiction: liveStockInfo.jurisdiction,
        label: `Live: ${liveStockInfo.symbol}`,
        summary: `Live quote from ${liveStockInfo.exchange} (${liveStockInfo.companyName})`,
        sampleUserPrompt: `Analyze ${liveStockInfo.symbol} with QRCE v3.1.0 using live quote data.`,
        input: simState,
      };
    }
    return (
      PRESET_SCENARIOS.find((p) => p.id === activePresetId) ||
      visiblePresets[0] ||
      PRESET_SCENARIOS[0]
    );
  }, [activePresetId, liveStockInfo, simState, visiblePresets]);

  const computed = useMemo(() => calculateQRCE(simState), [simState]);
  const currentWeights = MACRO_REGIMES[simState.regime].weights;

  const handleSelectJurisdiction = (jur: MarketJurisdiction) => {
    setSelectedJurisdiction(jur);
    const firstInJur = PRESET_SCENARIOS.find((p) => p.jurisdiction === jur);
    if (firstInJur) {
      setActivePresetId(firstInJur.id);
      setSimState(firstInJur.input);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'live-custom' && liveStockInfo) {
      setActivePresetId('live-custom');
      setSelectedJurisdiction(liveStockInfo.jurisdiction);
      return;
    }
    const found = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (found) {
      setActivePresetId(found.id);
      setSelectedJurisdiction(found.jurisdiction);
      setSimState(found.input);
    }
  };

  const handleReset = () => {
    if (activePresetId === 'live-custom' && liveStockInfo) {
      setSimState({
        ticker: liveStockInfo.symbol,
        companyName: liveStockInfo.companyName,
        jurisdiction: liveStockInfo.jurisdiction,
        regime: 'baseline',
        scores: {
          fin: liveStockInfo.suggestedFactorScores.fin,
          grw: liveStockInfo.suggestedFactorScores.grw,
          val: liveStockInfo.suggestedFactorScores.val,
          sen: liveStockInfo.suggestedFactorScores.sen,
          rsk: liveStockInfo.suggestedFactorScores.rsk,
        },
        hardData: {
          xbrlDivergencePenalty: false,
          consensusModifier: 'none',
        },
        altData: {
          insiderStatus: 'neutral',
          promoterPledgeHigh: false,
          shortInterestHigh: false,
          optionsFlow:
            liveStockInfo.volume > liveStockInfo.averageVolume * 1.25
              ? liveStockInfo.jurisdiction === 'india_nse_bse'
                ? 'fii_dii_delivery_bullish'
                : 'bullish_pcr_lt_0_6_darkpool'
              : 'neutral',
        },
        macroFilter: 'none',
        drivers: {
          bullFactor: `Live market price ${liveStockInfo.currency === 'INR' ? '₹' : '$'}${liveStockInfo.price} (${liveStockInfo.exchange}) trading at ${liveStockInfo.position52WeekPct.toFixed(1)}% of 52-week high.`,
          bearFactor: `Recent 1-month trajectory: ${liveStockInfo.monthReturnPct >= 0 ? '+' : ''}${liveStockInfo.monthReturnPct.toFixed(2)}%.`,
          insiderSignal:
            liveStockInfo.jurisdiction === 'india_nse_bse'
              ? 'SEBI PIT promoter disclosures neutral; verify quarterly shareholding pledge.'
              : 'SEC Form 4 disclosures neutral; no recent major executive dispositions.',
          criticalCatalyst: 'Awaiting next quarterly earnings concall and audited cash flow report.',
        },
      });
    } else {
      setSimState(activePreset.input);
    }
  };

  const updateScore = (key: keyof QRCESimulatorInput['scores'], val: number) => {
    setSimState((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [key]: val,
      },
    }));
  };

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText(computed.terminalOutput);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 1800);
  };

  const handleCopyBenchmarkPrompt = () => {
    navigator.clipboard.writeText(activePreset.sampleUserPrompt);
    setCopiedTestPrompt(true);
    setTimeout(() => setCopiedTestPrompt(false), 1800);
  };

  const factorConfig: Array<{
    key: keyof QRCESimulatorInput['scores'];
    title: string;
    symbol: string;
    weightPct: number;
    contribution: number;
  }> = [
    {
      key: 'fin',
      title: 'Financial Health & Solvency',
      symbol: 'S_FIN',
      weightPct: Math.round(currentWeights.fin * 100),
      contribution: computed.weightedContributions.fin,
    },
    {
      key: 'grw',
      title: 'Growth Momentum & Guidance',
      symbol: 'S_GRW',
      weightPct: Math.round(currentWeights.grw * 100),
      contribution: computed.weightedContributions.grw,
    },
    {
      key: 'val',
      title: 'Sector-Relative Valuation',
      symbol: 'S_VAL',
      weightPct: Math.round(currentWeights.val * 100),
      contribution: computed.weightedContributions.val,
    },
    {
      key: 'sen',
      title: 'Sentiment & Catalyst Velocity',
      symbol: 'S_SEN',
      weightPct: Math.round(currentWeights.sen * 100),
      contribution: computed.weightedContributions.sen,
    },
    {
      key: 'rsk',
      title: 'Risk, Debt & Governance',
      symbol: 'S_RSK',
      weightPct: Math.round(currentWeights.rsk * 100),
      contribution: computed.weightedContributions.rsk,
    },
  ];

  return (
    <section id="simulator" className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
            03. Deterministic CQS Formula Simulator &amp; Multi-Market Sandbox
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Audit how dynamic regime weights ($W_1 \dots W_5$) and regulatory $\Delta$ adjustments
            (BSE/NSE LODR Reg 33, SEBI PIT Promoter Pledges, or SEC EDGAR Form 4) determine the
            final institutional rating.
          </p>
        </div>

        {/* Market Jurisdiction Selector (Clean Segmented Control) */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => handleSelectJurisdiction('india_nse_bse')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedJurisdiction === 'india_nse_bse'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Indian Equities (NSE / BSE / SEBI)
          </button>
          <button
            type="button"
            onClick={() => handleSelectJurisdiction('us_global')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedJurisdiction === 'us_global'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            US &amp; Global (SEC / NYSE / NASDAQ)
          </button>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="mb-4 flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
        <span className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Presets:
        </span>
        {liveStockInfo && (
          <button
            type="button"
            onClick={() => handleSelectPreset('live-custom')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activePresetId === 'live-custom'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <Zap className="h-3 w-3" />
            <span>Live: {liveStockInfo.symbol}</span>
          </button>
        )}
        {visiblePresets.map((preset) => {
          const active = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Single-Elevation Split Workspace */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Top Rating Spectrum Bar */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-900">{simState.ticker}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">
                {isIndia ? 'NSE / BSE Jurisdiction' : 'SEC EDGAR Jurisdiction'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activePreset.summary}</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Scenario</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {RATING_SPECTRUM.map((tier) => {
              const isCurrent = computed.rating === tier.label;
              return (
                <div
                  key={tier.label}
                  className={`rounded-lg border px-3 py-2 text-center transition-colors tabular-nums ${
                    isCurrent
                      ? tier.activeClass
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold tracking-tight">{tier.label}</div>
                  <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[11px] opacity-85">
                    {tier.range}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-[460px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
          {/* Left Interactive Factor & Delta Controls */}
          <div className="divide-y divide-slate-200">
            {/* Ticker & Macro Regime */}
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="sim-ticker" className="block text-xs font-semibold text-slate-700">
                    Ticker {isIndia ? '(NSE/BSE)' : '(US)'}
                  </label>
                  <input
                    id="sim-ticker"
                    type="text"
                    maxLength={16}
                    value={simState.ticker}
                    onChange={(e) =>
                      setSimState((prev) => ({ ...prev, ticker: e.target.value.toUpperCase() }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-slate-900 uppercase focus:border-blue-700 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="sim-company" className="block text-xs font-semibold text-slate-700">
                    Company Name
                  </label>
                  <input
                    id="sim-company"
                    type="text"
                    value={simState.companyName}
                    onChange={(e) =>
                      setSimState((prev) => ({ ...prev, companyName: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sim-regime" className="block text-xs font-semibold text-slate-700">
                  Macroeconomic Regime (Dynamic Factor Weights)
                </label>
                <select
                  id="sim-regime"
                  value={simState.regime}
                  onChange={(e) =>
                    setSimState((prev) => ({
                      ...prev,
                      regime: e.target.value as MacroRegimeKey,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  {Object.values(MACRO_REGIMES).map((reg) => (
                    <option key={reg.key} value={reg.key}>
                      {reg.label} — W: [{Math.round(reg.weights.fin * 100)}/
                      {Math.round(reg.weights.grw * 100)}/{Math.round(reg.weights.val * 100)}/
                      {Math.round(reg.weights.sen * 100)}/{Math.round(reg.weights.rsk * 100)}]
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  {isIndia
                    ? MACRO_REGIMES[simState.regime].indiaDescription
                    : MACRO_REGIMES[simState.regime].description}
                </p>
              </div>
            </div>

            {/* 5 Continuous Sub-Scores */}
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  5-Factor Sub-Scores ([-100, +100])
                </span>
                <span className="font-[family-name:var(--font-mono)] text-slate-600 tabular-nums">
                  Weighted Base:{' '}
                  {computed.weightedBaseSum > 0
                    ? `+${computed.weightedBaseSum.toFixed(1)}`
                    : computed.weightedBaseSum.toFixed(1)}
                </span>
              </div>

              {factorConfig.map((f) => {
                const rawVal = simState.scores[f.key];
                return (
                  <div key={f.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs tabular-nums">
                      <span className="font-medium text-slate-800">
                        {f.title}{' '}
                        <span className="font-[family-name:var(--font-mono)] text-slate-400">
                          ({f.weightPct}%)
                        </span>
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-slate-700">
                        {rawVal > 0 ? `+${rawVal}` : rawVal} →{' '}
                        <strong className="text-slate-900">
                          {f.contribution > 0
                            ? `+${f.contribution.toFixed(1)}`
                            : f.contribution.toFixed(1)}
                        </strong>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      step={1}
                      aria-label={f.title}
                      value={rawVal}
                      onChange={(e) => updateScore(f.key, Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer accent-blue-700"
                    />
                  </div>
                );
              })}
            </div>

            {/* Hard Data, Insider/Promoter, & Macro Correction Layer */}
            <div className="space-y-3.5 p-6">
              <div className="text-xs font-semibold text-slate-900">
                {isIndia
                  ? 'BSE/NSE LODR Reg 33, SEBI PIT & RBI Correction Layer (Δ)'
                  : 'SEC EDGAR, Form 4 & Macro Correction Layer (Δ)'}
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-2 text-xs text-slate-700">
                <span>
                  {isIndia
                    ? 'LODR Reg 33 & Ind AS 7 Divergence (EBITDA spin vs FCF < 0 or Trade Debtors surge >15%)'
                    : 'XBRL Divergence (Profit spin vs. FCF < 0 or AR growing faster than revenue)'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-red-700 tabular-nums">
                    -20 pts
                  </span>
                  <input
                    type="checkbox"
                    checked={simState.hardData.xbrlDivergencePenalty}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        hardData: {
                          ...prev.hardData,
                          xbrlDivergencePenalty: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-700"
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="sim-consensus"
                    className="block text-[11px] font-medium text-slate-600"
                  >
                    Consensus Surprise
                  </label>
                  <select
                    id="sim-consensus"
                    value={simState.hardData.consensusModifier}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        hardData: {
                          ...prev.hardData,
                          consensusModifier:
                            e.target.value as QRCESimulatorInput['hardData']['consensusModifier'],
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="none">In-Line Consensus (0 pts)</option>
                    <option value="beat_gt_5">Beat &gt; 5% PAT/Rev (+10 pts)</option>
                    <option value="miss_gt_3">Miss &gt; 3% PAT/Rev (-15 pts)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sim-insider"
                    className="block text-[11px] font-medium text-slate-600"
                  >
                    {isIndia ? 'SEBI PIT Promoter Action' : 'Form 4 Insider Signal'}
                  </label>
                  <select
                    id="sim-insider"
                    value={simState.altData.insiderStatus}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        altData: {
                          ...prev.altData,
                          insiderStatus:
                            e.target.value as QRCESimulatorInput['altData']['insiderStatus'],
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="neutral">Neutral / Scheduled (0 pts)</option>
                    {isIndia ? (
                      <>
                        <option value="promoter_buy_25cr">Promoter Creep Buy &gt; ₹25 Cr (+10)</option>
                        <option value="promoter_sell_50cr">Promoter Block Dump &gt; ₹50 Cr (-15)</option>
                      </>
                    ) : (
                      <>
                        <option value="alignment_buy_500k">CEO/CFO Buy &gt;$500k (+10)</option>
                        <option value="divergence_sell_5m">C-Suite Sell &gt;$5M (-15)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sim-options"
                    className="block text-[11px] font-medium text-slate-600"
                  >
                    {isIndia ? 'NSE F&O / FII-DII Delivery' : 'Options & Dark Pool Flow'}
                  </label>
                  <select
                    id="sim-options"
                    value={simState.altData.optionsFlow}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        altData: {
                          ...prev.altData,
                          optionsFlow:
                            e.target.value as QRCESimulatorInput['altData']['optionsFlow'],
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="neutral">Neutral Flow (0 pts)</option>
                    {isIndia ? (
                      <>
                        <option value="fii_dii_delivery_bullish">FII+DII Delivery &gt; 60% (+10)</option>
                        <option value="bearish_pcr_gt_1_5">NSE F&amp;O PCR &gt; 1.4 Spike (-5)</option>
                        <option value="fii_heavy_outflow_bearish">FII Heavy Outflow Dump (-5)</option>
                      </>
                    ) : (
                      <>
                        <option value="bullish_pcr_lt_0_6_darkpool">PCR &lt; 0.6 + Dark Pool (+10)</option>
                        <option value="bearish_pcr_gt_1_5">PCR &gt; 1.5 Bearish Spike (-5)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sim-macro"
                    className="block text-[11px] font-medium text-slate-600"
                  >
                    {isIndia ? 'India Macro / RBI Context' : 'Macro Sector Filter'}
                  </label>
                  <select
                    id="sim-macro"
                    value={simState.macroFilter}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        macroFilter: e.target.value as QRCESimulatorInput['macroFilter'],
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="none">Neutral Sector (0 pts)</option>
                    {isIndia ? (
                      <>
                        <option value="india_capex_boom">India Capex / Govt Push (+10)</option>
                        <option value="defensive_bonus">High-Rate Banking / FMCG (+10)</option>
                        <option value="rbi_hawkish_crude_shock">Crude &gt; $90 / Hawkish RBI (-10)</option>
                        <option value="cyclical_downside">Rupee Depreciation / Import Drag (-10)</option>
                      </>
                    ) : (
                      <>
                        <option value="defensive_bonus">High-Rate Defensive (+10)</option>
                        <option value="cyclical_downside">PMI &lt; 48 Cyclical Drag (-10)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* India specific: Promoter Pledge Toggle */}
              {isIndia && (
                <label className="flex cursor-pointer items-center justify-between gap-2 pt-1 text-xs text-slate-700">
                  <span>Promoter Share Pledge &gt; 20% (Lender Margin Call / Liquidity Risk)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-red-700 tabular-nums">
                      -15 pts
                    </span>
                    <input
                      type="checkbox"
                      checked={simState.altData.promoterPledgeHigh}
                      onChange={(e) =>
                        setSimState((prev) => ({
                          ...prev,
                          altData: {
                            ...prev.altData,
                            promoterPledgeHigh: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-700"
                    />
                  </div>
                </label>
              )}

              <label className="flex cursor-pointer items-center justify-between gap-2 pt-1 text-xs text-slate-700">
                <span>
                  {isIndia
                    ? 'NSE F&O Ban (>95% MWPL) or Extreme Bearish Short Buildup'
                    : 'Short Interest > 15% Float & Days-to-Cover > 6'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-red-700 tabular-nums">
                    -10 pts
                  </span>
                  <input
                    type="checkbox"
                    checked={simState.altData.shortInterestHigh}
                    onChange={(e) =>
                      setSimState((prev) => ({
                        ...prev,
                        altData: {
                          ...prev.altData,
                          shortInterestHigh: e.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-700"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Right Live Terminal Output Display */}
          <div className="flex min-w-0 flex-col bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-5 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tabular-nums">
                <span className="font-semibold text-white">{computed.rating}</span>
                <span aria-hidden="true">·</span>
                <span className="font-[family-name:var(--font-mono)]">
                  CQS: {computed.clampedCqs > 0 ? `+${computed.clampedCqs}` : computed.clampedCqs} /
                  +100
                </span>
                <span aria-hidden="true">·</span>
                <span>Confidence: {computed.confidence}%</span>
                <span aria-hidden="true">·</span>
                <span>Stance: {computed.stance}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBenchmarkPrompt}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 whitespace-nowrap shrink-0"
                >
                  {copiedTestPrompt ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedTestPrompt ? 'Prompt Copied' : 'Copy Chatbot Prompt'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyTerminal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 whitespace-nowrap shrink-0"
                >
                  {copiedReport ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedReport ? 'Copied Output' : 'Copy Terminal Output'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto p-6">
              <pre className="font-[family-name:var(--font-mono)] text-xs leading-relaxed text-slate-100 tabular-nums">
                <code>{computed.terminalOutput}</code>
              </pre>
            </div>

            <div className="border-t border-slate-800 bg-slate-900/60 px-6 py-4 text-xs text-slate-400">
              <div className="font-medium text-slate-300">
                Sample Test Prompt for Chatbot / LLM ({simState.ticker}):
              </div>
              <p className="mt-1 leading-relaxed text-slate-400">{activePreset.sampleUserPrompt}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
