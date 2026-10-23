'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { triggerBlobDownload } from '@/lib/zip';
import { MarketJurisdiction } from '@/lib/qrce-engine';

type ChatbotPlatformId = 'claude' | 'chatgpt' | 'gemini' | 'universal' | 'json_api';
type RegimeOverride = 'auto' | 'high_rate' | 'bull_growth' | 'stagflation';

interface PlatformMeta {
  id: ChatbotPlatformId;
  shortLabel: string;
  title: string;
  targetModels: string;
  filename: string;
  charBudgetNote: string;
  stepsUs: [string, string, string];
  stepsIn: [string, string, string];
}

const PLATFORMS: PlatformMeta[] = [
  {
    id: 'claude',
    shortLabel: 'Claude 3.5 / 3.7',
    title: 'Anthropic Claude Projects & Agent Skills',
    targetModels: 'Claude 3.5 Sonnet · Claude 3.7 Sonnet · Claude Opus',
    filename: 'qrce-claude-project-directive.xml',
    charBudgetNote: 'XML-structured with <qrce_audit> verification scratchpad tags',
    stepsUs: [
      'Open Claude.ai -> Projects -> New Project (or open .claude/skills/qrce/ in Claude Code).',
      'Paste the compiled XML directive into Project Instructions for persistent equity analysis.',
      'Upload 10-K/10-Q filings or paste transcripts and prompt: "Run QRCE v3.0.0 on [TICKER]".',
    ],
    stepsIn: [
      'Open Claude.ai -> Projects -> New Project (name it "Indian Equity Quant Desk").',
      'Paste the compiled Indian Market XML directive into Project Instructions.',
      'Paste quarterly concall transcripts, BSE/NSE LODR filings, or prompt: "Run QRCE v3.0 on [RELIANCE.NS]".',
    ],
  },
  {
    id: 'chatgpt',
    shortLabel: 'ChatGPT (GPT-4o / o3)',
    title: 'OpenAI Custom GPT & Reasoning Prompt',
    targetModels: 'GPT-4o · o3 · o3-mini',
    filename: 'qrce-chatgpt-custom-gpt.txt',
    charBudgetNote: 'Optimized below OpenAI Custom GPT 8,000-character instruction limit',
    stepsUs: [
      'Open ChatGPT -> Explore GPTs -> Create -> Configure tab.',
      'Paste the compiled prompt into Instructions and enable Web Search + Code Interpreter.',
      'Optionally attach SKILL.md under Knowledge for deep methodology reference.',
    ],
    stepsIn: [
      'Open ChatGPT -> Explore GPTs -> Create -> Configure (name: "QRCE India Equities").',
      'Paste the compiled prompt and enable Web Search (for live bseindia/nseindia/screener data) + Code Interpreter.',
      'Use conversation starters like: "Run QRCE v3.0 on TATAMOTORS.NS using latest LODR Reg 33 results".',
    ],
  },
  {
    id: 'gemini',
    shortLabel: 'Google Gemini 1.5 / 2.0',
    title: 'Google Gemini Gems & Long-Context Audit',
    targetModels: 'Gemini 2.0 Flash · Gemini 1.5 Pro · Gemini 2.0 Pro',
    filename: 'qrce-gemini-gem-instructions.md',
    charBudgetNote: 'Tuned for multi-PDF 10-K / Annual Report & concall cross-examination',
    stepsUs: [
      'Open Google Gemini -> Gem Manager -> New Gem and name it "QRCE Equity Engine".',
      'Paste the compiled directive into Instructions and save your Gem.',
      'Drop full SEC 10-K, 10-Q, and Form 4 PDFs into the chat window to run audited CQS scoring.',
    ],
    stepsIn: [
      'Open Google Gemini -> Gem Manager -> New Gem ("QRCE India Equity Desk").',
      'Paste the compiled directive into Instructions and attach Indian Annual Reports / DRHP PDFs.',
      'Gemini 1M+ context window cross-checks Indian Annual Report Ind AS 7 cash flows against CEO commentary.',
    ],
  },
  {
    id: 'universal',
    shortLabel: 'Perplexity & DeepSeek',
    title: 'Universal Online AI Chatbot System Prompt',
    targetModels: 'Perplexity Spaces · DeepSeek R1/V3 · Grok · Poe · OpenWebUI',
    filename: 'qrce-universal-system-prompt.txt',
    charBudgetNote: 'Zero-dependency plain-text directive compatible with all chat frontends',
    stepsUs: [
      'Create a Perplexity Space (enable SEC + Web sources) or open your chatbot System Prompt panel.',
      'Paste the plain-text directive below into the System Prompt / Custom Instructions box.',
      'Enter any public ticker symbol to trigger live data retrieval and 80-column CQS rendering.',
    ],
    stepsIn: [
      'Create a Perplexity Space (search: BSE India, NSE India, Trendlyne, Screener.in) or OpenWebUI prompt.',
      'Paste the plain-text Indian market directive below into the System Prompt box.',
      'Prompt with any NSE/BSE ticker (e.g. INFY.NS, HDFCBANK.NS, ZOMATO.NS) for live quant ratings.',
    ],
  },
  {
    id: 'json_api',
    shortLabel: 'Structured JSON API',
    title: 'Programmatic LLM Pipeline & Tool Schema',
    targetModels: 'OpenAI Structured Outputs · Gemini responseSchema · Anthropic Tool Use',
    filename: 'qrce-structured-api-prompt.md',
    charBudgetNote: 'Pairs deterministic system rules with strict Draft 2020-12 JSON output keys',
    stepsUs: [
      'Pass the system directive below as the system instruction in your SDK request.',
      'Bind schemas/qrce-output.schema.json from this repository to response_format / responseSchema.',
      'Validate returned scores downstream using scripts/qrce_validator.py.',
    ],
    stepsIn: [
      'Pass the Indian-market directive below as the system prompt in your backend LLM call.',
      'Bind schemas/qrce-output.schema.json to enforce strict JSON output with Indian market parameters.',
      'Audit generated CQS scores via python3 scripts/qrce_validator.py --market in.',
    ],
  },
];

export default function ChatbotAdapterStudio() {
  const [jurisdiction, setJurisdiction] = useState<MarketJurisdiction>('india_nse_bse');
  const [platformId, setPlatformId] = useState<ChatbotPlatformId>('claude');
  const [regimeOverride, setRegimeOverride] = useState<RegimeOverride>('auto');
  const [includeScratchpad, setIncludeScratchpad] = useState<boolean>(true);
  const [dualJsonOutput, setDualJsonOutput] = useState<boolean>(false);
  const [strictEdgarCitations, setStrictEdgarCitations] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const isIndia = jurisdiction === 'india_nse_bse';

  const activePlatform = useMemo(
    () => PLATFORMS.find((p) => p.id === platformId) || PLATFORMS[0],
    [platformId]
  );

  const compiledDirective = useMemo(() => {
    const regimeInstruction = isIndia
      ? regimeOverride === 'auto'
        ? 'AUTO-DETECT prevailing Indian Macroeconomic Regime before scoring (Baseline: 30/25/20/15/10 | High Inflation/RBI Hawkish: 40/15/20/15/10 | Capex Expansion Bull: 20/35/20/15/10 | Global Contagion/Stagflation: 45/10/25/10/10).'
        : regimeOverride === 'high_rate'
        ? 'LOCKED REGIME OVERRIDE: High Interest Rate / Hawkish RBI Regime (W1_FIN=0.40, W2_GRW=0.15, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
        : regimeOverride === 'bull_growth'
        ? 'LOCKED REGIME OVERRIDE: Capex Expansion / Domestic Bull Regime (W1_FIN=0.20, W2_GRW=0.35, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
        : 'LOCKED REGIME OVERRIDE: Global Contagion / Stagflation Regime (W1_FIN=0.45, W2_GRW=0.10, W3_VAL=0.25, W4_SEN=0.10, W5_RSK=0.10).'
      : regimeOverride === 'auto'
      ? 'AUTO-DETECT prevailing Macroeconomic Regime from input/macro context before scoring (Baseline: 30/25/20/15/10 | High Rate/Inflation: 40/15/20/15/10 | Bull Growth: 20/35/20/15/10 | Stagflation/Recession: 45/10/25/10/10).'
      : regimeOverride === 'high_rate'
      ? 'LOCKED REGIME OVERRIDE: High Interest Rate / Inflation Regime (W1_FIN=0.40, W2_GRW=0.15, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
      : regimeOverride === 'bull_growth'
      ? 'LOCKED REGIME OVERRIDE: High Growth / Low Rate Bull Regime (W1_FIN=0.20, W2_GRW=0.35, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
      : 'LOCKED REGIME OVERRIDE: Recessionary / Stagflation Regime (W1_FIN=0.45, W2_GRW=0.10, W3_VAL=0.25, W4_SEN=0.10, W5_RSK=0.10).';

    const scratchpadBlock = includeScratchpad
      ? 'PRE-OUTPUT VERIFICATION: Before printing the terminal report, verify that sum(W_i) == 1.00 and calculate exact arithmetic products (W_i * S_i) plus all Delta modifiers so zero arithmetic drift occurs.'
      : 'CONCISE EXECUTION: Compute all sub-scores and Delta adjustments silently and output ONLY the final 80-column QUANTITATIVE ANALYSIS ENGINE terminal block.';

    const citationRule = isIndia
      ? strictEdgarCitations
        ? 'INDIAN REGULATORY & HARD-DATA INTEGRITY: Cross-examine management earnings concalls against BSE/NSE LODR Regulation 33 quarterly results, audited Ind AS 7 Statement of Cash Flows (Operating Cash Flow - Capex = Free Cash Flow), Trade Debtors YoY growth vs Revenue growth, and SEBI PIT Regulation 7(2) / SAST Promoter filings. Check Promoter Share Pledges on BSE/NSE shareholding patterns. If an alt-data feed is unavailable, assign 0 points to that modifier.'
        : 'DATA HANDLING: Score using available BSE/NSE disclosures and search context; default unavailable alternative-data modifiers to 0 points.'
      : strictEdgarCitations
      ? 'HARD-DATA INTEGRITY: Cross-check management tone against audited 10-K/10-Q Free Cash Flow (OCF - CapEx), Accounts Receivable vs. Revenue growth, and Form 4 Code P/S filings. Never hallucinate figures; if an alternative data feed is unavailable, assign 0 points to that modifier and note data availability.'
      : 'DATA HANDLING: Score using all metrics present in the user prompt and available search context; default unavailable alternative-data modifiers to 0 points.';

    const deltaLayer = isIndia
      ? `HARD & ALT-DATA DELTA LAYER (INDIA SPECIFIC):
  - Delta_HardData:
    * BSE/NSE LODR Reg 33 & Ind AS 7 Divergence (-20 pts): Management EBITDA optimism contradicted by negative Free Cash Flow or Trade Debtors outgrowing revenue by >15% YoY.
    * Consensus Surprise (Bloomberg/Trendlyne): PAT/Revenue Beat >5% (+10 pts) | Miss >3% (-15 pts).
  - Delta_AltData (SEBI PIT Reg 7, Promoter Pledging & NSE F&O):
    * Promoter Creep Buying / Open-Market Acquisition > ₹25 Cr (+10 pts).
    * Promoter Net Stake Dumping / Block Dispositions > ₹50 Cr (-15 pts).
    * High Promoter Share Pledge (> 20% of promoter holding pledged to NBFCs/Banks) (-15 pts governance/margin-call risk).
    * FII + DII Combined Net Buying with NSE Delivery % > 60% (+10 pts).
    * NSE Stock F&O Put-Call Ratio > 1.4 or Stock entered F&O Ban (>95% MWPL) (-10 pts).
    * NSE Stock F&O Put-Call Ratio < 0.7 with Heavy DII Block Absorption (+10 pts).
  - Delta_Macro (RBI Monetary Policy & India Macro):
    * Brent Crude > $90/bbl OR Hawkish RBI Rate Hike OR Inverted Yield Spread on Cyclical/Import sectors (-10 pts).
    * Government Capex Push (Railways, Defense, Infra, Capital Goods) OR High-Rate Banking/FMCG Defensive Bonus (+10 pts).`
      : `HARD & ALT-DATA DELTA LAYER (US SPECIFIC):
  - Delta_HardData: XBRL Divergence (-20 pts if bullish profit claims vs. FCF<0 or AR>Rev growth); Consensus Beat >5% (+10 pts) or Miss >3% (-15 pts).
  - Delta_AltData: Bullish exec tone + Form 4 C-Suite net selling >$5M in 90d (-15 pts); CEO/CFO open-market purchase >$500k (+10 pts); Short Interest >15% & DTC >6 (-10 pts); Put/Call >1.5 (-5 pts) or <0.6 with Dark Pool inflows (+10 pts).
  - Delta_Macro: Inverted Curve / PMI <48 on Industrials/Discretionary (-10 pts); High Rate regime on cash-rich low-debt Healthcare/Staples (+10 pts).`;

    const jsonSuffix = dualJsonOutput
      ? '\nDUAL OUTPUT MODE: Immediately after the closing === line of the ASCII terminal block, emit a valid JSON code block containing { "ticker", "jurisdiction", "macro_regime", "final_rating", "composite_quant_score", "confidence_score_pct", "factor_breakdown", "adjustments" }.'
      : '';

    const coreRules = [
      `TARGET JURISDICTION: ${isIndia ? 'INDIA (NSE & BSE / SEBI REGULATORY FRAMEWORK)' : 'US & GLOBAL (SEC EDGAR / NYSE / NASDAQ)'}`,
      `REGIME WEIGHTING: ${regimeInstruction}`,
      `CONTINUOUS SUB-SCORES (S_i in [-100, +100]):`,
      `  [1] S_FIN (Financial Health): +100 (Net margin>20%, FCF yield>8%, Int Cov>8x, D/E<0.3) | 0 (Stable, Int Cov 2-4x) | -100 (Cash burn, OCF<0, Debt/EBITDA>5x).`,
      `  [2] S_GRW (Growth Momentum): +100 (Rev YoY>25% accelerating, raised guidance, expanding TAM) | 0 (0-5% growth, flat guidance) | -100 (Rev contraction, cut guidance).`,
      `  [3] S_VAL (Sector-Relative Valuation): Evaluate strictly vs. Sector Peer Medians. +100 (<15th pct peers, Margin of Safety>30%) | 0 (+/-10% of peer median) | -100 (>90th pct peers, PEG>3.0).`,
      `  [4] S_SEN (Sentiment & Velocity): +100 (Institutional accumulation, 3+ upgrades in 30d) | 0 (Neutral) | -100 (Net distribution, downgrades, major litigation).`,
      `  [5] S_RSK (Risk & Governance): +100 (Clean audits, low-multiple buybacks, independent board) | 0 (Standard) | -100 (Restatements, regulatory probe, >50% exec turnover, 12m debt wall).`,
      deltaLayer,
      `FORMULA & ACTIONABLE THRESHOLDS:`,
      `  CQS = clamp(-100, +100, sum(W_i * S_i) + Delta_HardData + Delta_AltData + Delta_Macro)`,
      `  STRONG BUY (+65..+100, >=85% conf, 6-12m, Accumulate) | BUY (+20..+64, >=70% conf, 6-12m, Accumulate) | HOLD (-19..+19, Neutral, Hold) | SELL (-64..-20, >=70% conf, 3-6m, Reduce) | STRONG SELL (-100..-65, >=85% conf, Immediate, Exit).`,
      citationRule,
      scratchpadBlock,
    ].join('\n');

    const marketHeader = isIndia
      ? 'JURISDICTION   : INDIA (NSE & BSE / SEBI LODR REG 33 & PIT REG 7)'
      : 'JURISDICTION   : US & GLOBAL (SEC EDGAR / NYSE / NASDAQ / FORM 4)';

    const hardLine = isIndia
      ? '- BSE/NSE LODR Reg 33 & Ind AS 7 Check : [ Delta_HardData Points ]'
      : '- SEC EDGAR / Consensus Verification : [ Delta_HardData Points ]';

    const insiderLine = isIndia
      ? '- SEBI PIT Reg 7(2) Promoter Action  : [ Delta_AltData Points ]\n- Promoter Share Pledge Risk (>20%)   : [ Delta_Pledge Points ]'
      : '- Form 4 Insider Trading Alignment   : [ Delta_AltData Points ]';

    const optionsLine = isIndia
      ? '- NSE F&O, MWPL & FII/DII Delivery   : [ Delta_Options Points ]'
      : '- Short Interest / Options Sentiment : [ Delta_Options Points ]';

    const macroLine = isIndia
      ? '- RBI MPC & India Macro Normalization: [ Delta_Macro Points ]'
      : '- Macro & Sector Normalization       : [ Delta_Macro Points ]';

    const asciiTemplate = `================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : [Extract Ticker / Company Name]
${marketHeader}
MACRO REGIME    : [ High Rate/Inflation | Bull Growth | Stagflation/Recession ]
TIMESTAMP       : [Current Date / Time]
--------------------------------------------------------------------------------

FINAL RATING    : [ STRONG BUY | BUY | HOLD | SELL | STRONG SELL ]
COMPOSITE QUANT SCORE (CQS) : [Calculated Value] / +100
CONFIDENCE SCORE           : [Percentage]%

--------------------------------------------------------------------------------
FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)
--------------------------------------------------------------------------------
[1] Financial Health ([W1]%) : Score = [S_FIN] | Contribution = [W1 * S_FIN]
[2] Growth Momentum  ([W2]%) : Score = [S_GRW] | Contribution = [W2 * S_GRW]
[3] Valuation (Peer) ([W3]%) : Score = [S_VAL] | Contribution = [W3 * S_VAL]
[4] Sentiment        ([W4]%) : Score = [S_SEN] | Contribution = [W4 * S_SEN]
[5] Risk Profile     ([W5]%) : Score = [S_RSK] | Contribution = [W5 * S_RSK]
--------------------------------------------------------------------------------

HARD DATA & ALT-DATA ADJUSTMENTS
--------------------------------------------------------------------------------
${hardLine}
${insiderLine}
${optionsLine}
${macroLine}
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : [Key positive metric/evidence from input]
- Primary Bear Factor : [Key negative metric/risk from input]
- Form 4 / SEBI PIT Signal : [Insider/Promoter summary]
- Critical Catalyst   : [Key event or forward guidance item]

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : [Accumulate / Hold / Reduce / Exit]
- Horizon    : [Tactical Timeframe]
================================================================================`;

    if (platformId === 'claude') {
      return `<system_directive version="3.0.0" author="Sparsh Keshwani" engine="QRCE" market="${jurisdiction}">\n${coreRules}\n\n<required_terminal_template>\n${asciiTemplate}\n</required_terminal_template>${jsonSuffix}\n</system_directive>`;
    }

    if (platformId === 'chatgpt') {
      return `ROLE: Quantitative Rating & Conversion Engine (QRCE v3.0.0) by Sparsh Keshwani.\nMARKET: ${isIndia ? 'Indian Stock Market (NSE / BSE / SEBI LODR)' : 'US & Global (SEC EDGAR / NYSE / NASDAQ)'}\nTOOLS: Use Web Search to verify latest filings (BSE/NSE/Screener.in or SEC 10-Q/10-K), consensus surprises, and promoter/insider filings. Use Code Interpreter to verify CQS arithmetic.\n\n${coreRules}\n\nREQUIRED TERMINAL DISPLAY TEMPLATE:\n${asciiTemplate}${jsonSuffix}`;
    }

    if (platformId === 'gemini') {
      return `# GEMINI GEM SYSTEM DIRECTIVE — QRCE v3.0.0 (Author: Sparsh Keshwani)\nTarget: ${isIndia ? 'Indian Stock Market (NSE & BSE)' : 'US & Global Equities'}\n\n${coreRules}\n\nREQUIRED OUTPUT TEMPLATE:\n\`\`\`text\n${asciiTemplate}\n\`\`\`${jsonSuffix}`;
    }

    if (platformId === 'json_api') {
      return `SYSTEM INSTRUCTION (QRCE v3.0.0 — Author: Sparsh Keshwani)\nMarket Jurisdiction: ${jurisdiction}\nBind with schemas/qrce-output.schema.json for deterministic JSON + ASCII rendering.\n\n${coreRules}\n\nPopulate formatted_terminal_report using:\n${asciiTemplate}`;
    }

    return `SYSTEM PROMPT: QUANTITATIVE RATING & CONVERSION ENGINE (QRCE v3.0.0)\nAuthor: Sparsh Keshwani\nMarket: ${isIndia ? 'Indian Stock Market (BSE/NSE)' : 'US & Global'}\n\n${coreRules}\n\nREQUIRED OUTPUT DISPLAY TEMPLATE:\n${asciiTemplate}${jsonSuffix}`;
  }, [jurisdiction, platformId, regimeOverride, includeScratchpad, dualJsonOutput, strictEdgarCitations, isIndia]);

  const charCount = compiledDirective.length;
  const estTokens = Math.round(charCount / 3.85);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledDirective);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadPrompt = () => {
    const filename = isIndia
      ? `qrce-india-${activePlatform.filename}`
      : activePlatform.filename;
    const blob = new Blob([compiledDirective], { type: 'text/plain;charset=utf-8' });
    triggerBlobDownload(blob, filename);
  };

  const currentSteps = isIndia ? activePlatform.stepsIn : activePlatform.stepsUs;

  return (
    <section id="chatbots" className="border-y border-slate-200 bg-slate-50/70 py-14">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
              02. Online AI Chatbot &amp; LLM Deployment Studio
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Generate tailored system prompts for Indian Stock Market (NSE/BSE/SEBI) or US &amp; Global (SEC EDGAR),
              engineered for Claude Projects, ChatGPT Custom GPTs, Gemini Gems, and Perplexity Spaces.
            </p>
          </div>

          {/* Market Jurisdiction Selector (Clean Segmented Control) */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setJurisdiction('india_nse_bse')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isIndia
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Indian Equities (NSE/BSE)
            </button>
            <button
              type="button"
              onClick={() => setJurisdiction('us_global')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                !isIndia
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              US &amp; Global (SEC)
            </button>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {PLATFORMS.map((p) => {
            const active = p.id === platformId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatformId(p.id)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {p.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Single-Elevation Container with Hairline Dividers */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-[380px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
            {/* Left Configuration Column */}
            <div className="divide-y divide-slate-200">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-slate-900">
                    {activePlatform.title}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {isIndia ? 'Optimized for NSE & BSE India' : activePlatform.targetModels}
                </p>
                <p className="mt-2 text-xs text-slate-600">{activePlatform.charBudgetNote}</p>

                <ol className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-700">
                  {currentSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="font-[family-name:var(--font-mono)] font-semibold text-blue-700 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Directive Parameter Controls */}
              <div className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="regime-override-select"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Macro Regime Behavior
                  </label>
                  <select
                    id="regime-override-select"
                    value={regimeOverride}
                    onChange={(e) => setRegimeOverride(e.target.value as RegimeOverride)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
                  >
                    <option value="auto">Auto-Detect Regime from Context (Default)</option>
                    <option value="high_rate">
                      {isIndia
                        ? 'Lock: High Inflation / Hawkish RBI (40/15/20/15/10)'
                        : 'Lock: High Interest Rate / Inflation (40/15/20/15/10)'}
                    </option>
                    <option value="bull_growth">
                      {isIndia
                        ? 'Lock: Capex Expansion / Domestic Bull (20/35/20/15/10)'
                        : 'Lock: Bull Growth Regime (20/35/20/15/10)'}
                    </option>
                    <option value="stagflation">
                      {isIndia
                        ? 'Lock: Global Contagion / Stagflation (45/10/25/10/10)'
                        : 'Lock: Recessionary / Stagflation (45/10/25/10/10)'}
                    </option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeScratchpad}
                    onChange={(e) => setIncludeScratchpad(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                  />
                  <span>
                    <strong className="font-medium text-slate-900">
                      Enforce Pre-Output Math Audit
                    </strong>
                    <span className="block text-slate-500">
                      Requires chatbot to verify weight sums and calculate exact W_i * S_i products before
                      printing CQS.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={strictEdgarCitations}
                    onChange={(e) => setStrictEdgarCitations(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                  />
                  <span>
                    <strong className="font-medium text-slate-900">
                      {isIndia
                        ? 'SEBI LODR & Ind AS 7 Guardrail'
                        : 'Anti-Hallucination EDGAR Guardrail'}
                    </strong>
                    <span className="block text-slate-500">
                      {isIndia
                        ? 'Zero-fills missing promoter pledge or F&O data instead of speculative guesses.'
                        : 'Zero-fills missing alt-data feeds instead of allowing speculative estimates.'}
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={dualJsonOutput}
                    onChange={(e) => setDualJsonOutput(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                  />
                  <span>
                    <strong className="font-medium text-slate-900">
                      Append Machine-Readable JSON Block
                    </strong>
                    <span className="block text-slate-500">
                      Outputs structured JSON payload right below the 80-column ASCII terminal
                      report.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Right Compiled Prompt Output */}
            <div className="flex min-w-0 flex-col bg-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-5 py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
                  <span className="font-[family-name:var(--font-mono)] font-medium text-slate-200">
                    {isIndia ? `india-${activePlatform.filename}` : activePlatform.filename}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{charCount.toLocaleString()} chars</span>
                  <span aria-hidden="true">·</span>
                  <span>~{estTokens.toLocaleString()} tokens</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 whitespace-nowrap shrink-0"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied Prompt' : 'Copy System Prompt'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPrompt}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre className="max-h-[540px] flex-1 overflow-auto p-5 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-slate-100 whitespace-pre-wrap tabular-nums">
                <code>{compiledDirective}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
