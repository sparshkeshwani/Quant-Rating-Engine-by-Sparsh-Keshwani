'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { triggerBlobDownload } from '@/lib/zip';

type ChatbotPlatformId = 'claude' | 'chatgpt' | 'gemini' | 'universal' | 'json_api';
type RegimeOverride = 'auto' | 'high_rate' | 'bull_growth' | 'stagflation';

interface PlatformMeta {
  id: ChatbotPlatformId;
  shortLabel: string;
  title: string;
  targetModels: string;
  filename: string;
  charBudgetNote: string;
  steps: [string, string, string];
}

const PLATFORMS: PlatformMeta[] = [
  {
    id: 'claude',
    shortLabel: 'Claude 3.5 / 3.7',
    title: 'Anthropic Claude Projects & Agent Skills',
    targetModels: 'Claude 3.5 Sonnet · Claude 3.7 Sonnet · Claude Opus',
    filename: 'qrce-claude-project-directive.xml',
    charBudgetNote: 'XML-structured with <qrce_audit> chain-of-verification tags',
    steps: [
      'Open Claude.ai -> Projects -> New Project (or open .claude/skills/qrce/ in Claude Code).',
      'Paste the compiled XML directive into Project Instructions so it persists across every equity chat.',
      'Upload 10-K/10-Q PDFs or paste earnings transcripts and prompt: "Run QRCE v3.0.0 on [TICKER]".',
    ],
  },
  {
    id: 'chatgpt',
    shortLabel: 'ChatGPT (GPT-4o / o3)',
    title: 'OpenAI Custom GPT & Reasoning Prompt',
    targetModels: 'GPT-4o · o3 · o3-mini',
    filename: 'qrce-chatgpt-custom-gpt.txt',
    charBudgetNote: 'Optimized below OpenAI Custom GPT 8,000-character instruction ceiling',
    steps: [
      'Open ChatGPT -> Explore GPTs -> Create -> Configure tab.',
      'Paste the compiled prompt into Instructions and enable Web Search + Code Interpreter.',
      'Optionally attach SKILL.md under Knowledge for long-form methodology reference.',
    ],
  },
  {
    id: 'gemini',
    shortLabel: 'Google Gemini 1.5 / 2.0',
    title: 'Google Gemini Gems & 1M-Context Filing Audit',
    targetModels: 'Gemini 2.0 Flash · Gemini 1.5 Pro · Gemini 2.0 Pro',
    filename: 'qrce-gemini-gem-instructions.md',
    charBudgetNote: 'Tuned for multi-PDF SEC 10-K/10-Q XBRL cash-flow cross-examination',
    steps: [
      'Open Google Gemini -> Gem Manager -> New Gem and name it "QRCE Equity Engine".',
      'Paste the compiled directive into Instructions and save your Gem.',
      'Drop full SEC 10-K, 10-Q, and Form 4 PDFs into the chat window to run audited CQS scoring.',
    ],
  },
  {
    id: 'universal',
    shortLabel: 'Perplexity & DeepSeek',
    title: 'Universal Online AI Chatbot System Prompt',
    targetModels: 'Perplexity Spaces · DeepSeek R1/V3 · Grok · Poe · OpenWebUI',
    filename: 'qrce-universal-system-prompt.txt',
    charBudgetNote: 'Zero-dependency plain-text directive compatible with all chat frontends',
    steps: [
      'Create a Perplexity Space (enable SEC + Web sources) or open your chatbot System Prompt panel.',
      'Paste the plain-text directive below into the System Prompt / Custom Instructions box.',
      'Enter any public ticker symbol to trigger live data retrieval and 80-column CQS rendering.',
    ],
  },
  {
    id: 'json_api',
    shortLabel: 'Structured JSON API',
    title: 'Programmatic LLM Pipeline & Tool Schema Wrapper',
    targetModels: 'OpenAI Structured Outputs · Gemini responseSchema · Anthropic Tool Use',
    filename: 'qrce-structured-api-prompt.md',
    charBudgetNote: 'Pairs deterministic system rules with strict Draft 2020-12 JSON output keys',
    steps: [
      'Pass the system directive below as the system instruction in your SDK request.',
      'Bind schemas/qrce-output.schema.json from this repository to response_format / responseSchema.',
      'Validate returned scores downstream using scripts/qrce_validator.py.',
    ],
  },
];

export default function ChatbotAdapterStudio() {
  const [platformId, setPlatformId] = useState<ChatbotPlatformId>('claude');
  const [regimeOverride, setRegimeOverride] = useState<RegimeOverride>('auto');
  const [includeScratchpad, setIncludeScratchpad] = useState<boolean>(true);
  const [dualJsonOutput, setDualJsonOutput] = useState<boolean>(false);
  const [strictEdgarCitations, setStrictEdgarCitations] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const activePlatform = useMemo(
    () => PLATFORMS.find((p) => p.id === platformId) || PLATFORMS[0],
    [platformId]
  );

  const compiledDirective = useMemo(() => {
    const regimeInstruction =
      regimeOverride === 'auto'
        ? 'AUTO-DETECT prevailing Macroeconomic Regime from input/macro context before scoring (Baseline: 30/25/20/15/10 | High Rate/Inflation: 40/15/20/15/10 | Bull Growth: 20/35/20/15/10 | Stagflation/Recession: 45/10/25/10/10).'
        : regimeOverride === 'high_rate'
        ? 'LOCKED REGIME OVERRIDE: High Interest Rate / Inflation Regime (W1_FIN=0.40, W2_GRW=0.15, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
        : regimeOverride === 'bull_growth'
        ? 'LOCKED REGIME OVERRIDE: High Growth / Low Rate Bull Regime (W1_FIN=0.20, W2_GRW=0.35, W3_VAL=0.20, W4_SEN=0.15, W5_RSK=0.10).'
        : 'LOCKED REGIME OVERRIDE: Recessionary / Stagflation Regime (W1_FIN=0.45, W2_GRW=0.10, W3_VAL=0.25, W4_SEN=0.10, W5_RSK=0.10).';

    const scratchpadBlock = includeScratchpad
      ? 'PRE-OUTPUT VERIFICATION: Before printing the terminal report, verify that sum(W_i) == 1.00 and show exact arithmetic products (W_i * S_i) plus all four Delta modifiers so zero rounding drift occurs.'
      : 'CONCISE EXECUTION: Compute all sub-scores and Delta adjustments silently and output ONLY the final 80-column QUANTITATIVE ANALYSIS ENGINE terminal block.';

    const citationRule = strictEdgarCitations
      ? 'HARD-DATA INTEGRITY: Cross-check management tone against audited 10-K/10-Q Free Cash Flow (OCF - CapEx), Accounts Receivable vs. Revenue growth, and Form 4 Code P/S filings. Never hallucinate figures; if an alternative data feed is unavailable, assign 0 points to that modifier and note data availability.'
      : 'DATA HANDLING: Score using all metrics present in the user prompt and available search context; default unavailable alternative-data modifiers to 0 points.';

    const jsonSuffix = dualJsonOutput
      ? '\nDUAL OUTPUT MODE: Immediately after the closing === line of the ASCII terminal block, emit a valid JSON code block containing { "ticker", "macro_regime", "final_rating", "composite_quant_score", "confidence_score_pct", "factor_breakdown", "adjustments" }.'
      : '';

    const coreRules = [
      `REGIME WEIGHTING: ${regimeInstruction}`,
      `CONTINUOUS SUB-SCORES (S_i in [-100, +100]):`,
      `  [1] S_FIN (Financial Health): +100 (Net margin>20%, FCF yield>8%, Int Cov>8x, D/E<0.3) | 0 (Stable, Int Cov 2-4x) | -100 (Cash burn, OCF<0, Debt/EBITDA>5x).`,
      `  [2] S_GRW (Growth Momentum): +100 (Rev YoY>25% accelerating, raised guidance, expanding TAM) | 0 (0-5% growth, flat guidance) | -100 (Rev contraction, cut guidance).`,
      `  [3] S_VAL (Sector-Relative Valuation): Evaluate strictly vs. Sector Peer Medians. +100 (<15th pct peers, Margin of Safety>30%) | 0 (+/-10% of peer median) | -100 (>90th pct peers, PEG>3.0).`,
      `  [4] S_SEN (Sentiment & Velocity): +100 (Institutional buying, 3+ upgrades in 30d) | 0 (Neutral) | -100 (Net distribution, downgrades, major litigation).`,
      `  [5] S_RSK (Risk & Governance): +100 (Clean audits, low-multiple buybacks, independent board) | 0 (Standard) | -100 (Restatements, SEC probe, >50% exec turnover, 12m debt wall).`,
      `HARD & ALT-DATA DELTA LAYER:`,
      `  - Delta_HardData: XBRL Divergence (-20 pts if bullish profit claims vs. FCF<0 or AR>Rev growth); Consensus Beat >5% (+10 pts) or Miss >3% (-15 pts).`,
      `  - Delta_AltData: Bullish exec tone + Form 4 C-Suite net selling >$5M in 90d (-15 pts); CEO/CFO open-market purchase >$500k (+10 pts); Short Interest >15% & DTC >6 (-10 pts); Put/Call >1.5 (-5 pts) or <0.6 with Dark Pool inflows (+10 pts).`,
      `  - Delta_Macro: Inverted Curve / PMI <48 on Industrials/Discretionary (-10 pts); High Rate regime on cash-rich low-debt Healthcare/Staples (+10 pts).`,
      `FORMULA & ACTIONABLE THRESHOLDS:`,
      `  CQS = clamp(-100, +100, sum(W_i * S_i) + Delta_HardData + Delta_AltData + Delta_Macro)`,
      `  STRONG BUY (+65..+100, >=85% conf, 6-12m, Accumulate) | BUY (+20..+64, >=70% conf, 6-12m, Accumulate) | HOLD (-19..+19, Neutral, Hold) | SELL (-64..-20, >=70% conf, 3-6m, Reduce) | STRONG SELL (-100..-65, >=85% conf, Immediate, Exit).`,
      citationRule,
      scratchpadBlock,
    ].join('\n');

    const asciiTemplate = `================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : [Extract Ticker / Company Name]
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
- SEC EDGAR / Consensus Verification : [ Delta_HardData Points ]
- Form 4 Insider Trading Alignment   : [ Delta_AltData Points ]
- Short Interest / Options Sentiment : [ Delta_Options Points ]
- Macro & Sector Normalization       : [ Delta_Macro Points ]
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : [Key positive metric/evidence from input]
- Primary Bear Factor : [Key negative metric/risk from input]
- Form 4 & Insider Signal : [Insider buying/selling summary]
- Critical Catalyst   : [Key event or forward guidance item]

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : [Accumulate / Hold / Reduce / Exit]
- Horizon    : [Tactical Timeframe]
================================================================================`;

    if (platformId === 'claude') {
      return `<system_directive version="3.0.0" author="Sparsh Keshwani" engine="QRCE">\n${coreRules}\n\n<required_terminal_template>\n${asciiTemplate}\n</required_terminal_template>${jsonSuffix}\n</system_directive>`;
    }

    if (platformId === 'chatgpt') {
      return `ROLE: Quantitative Rating & Conversion Engine (QRCE v3.0.0) by Sparsh Keshwani.\nTOOLS: Use Web Search to verify latest 10-Q/10-K XBRL, consensus surprises, and Form 4 filings when not pasted. Use Python Code Interpreter to verify weighted CQS math.\n\n${coreRules}\n\nREQUIRED TERMINAL DISPLAY TEMPLATE:\n${asciiTemplate}${jsonSuffix}`;
    }

    if (platformId === 'gemini') {
      return `# GEMINI GEM SYSTEM DIRECTIVE — QRCE v3.0.0 (Author: Sparsh Keshwani)\nLong-Context Filing Audit Mode: Cross-reference attached 10-K/10-Q PDF statements of cash flows and balance sheets against management narrative.\n\n${coreRules}\n\nREQUIRED OUTPUT TEMPLATE:\n\`\`\`text\n${asciiTemplate}\n\`\`\`${jsonSuffix}`;
    }

    if (platformId === 'json_api') {
      return `SYSTEM INSTRUCTION (QRCE v3.0.0 — Author: Sparsh Keshwani)\n Bind with schemas/qrce-output.schema.json for deterministic JSON + ASCII rendering.\n\n${coreRules}\n\nPopulate formatted_terminal_report using:\n${asciiTemplate}`;
    }

    return `SYSTEM PROMPT: QUANTITATIVE RATING & CONVERSION ENGINE (QRCE v3.0.0)\nAuthor: Sparsh Keshwani\n\n${coreRules}\n\nREQUIRED OUTPUT DISPLAY TEMPLATE:\n${asciiTemplate}${jsonSuffix}`;
  }, [platformId, regimeOverride, includeScratchpad, dualJsonOutput, strictEdgarCitations]);

  const charCount = compiledDirective.length;
  const estTokens = Math.round(charCount / 3.85);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledDirective);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([compiledDirective], { type: 'text/plain;charset=utf-8' });
    triggerBlobDownload(blob, activePlatform.filename);
  };

  return (
    <section id="chatbots" className="border-y border-slate-200 bg-slate-50/70 py-14">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
              02. Online AI Chatbot & LLM Deployment Studio
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Generate tailored system prompts formatted for Claude Projects, ChatGPT Custom GPTs,
              Google Gemini Gems, Perplexity Spaces, or structured JSON API pipelines.
            </p>
          </div>

          {/* Segmented Platform Tabs (Interactive Controls) */}
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            {PLATFORMS.map((p) => {
              const active = p.id === platformId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatformId(p.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Single-Elevation Container with Hairline Dividers */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-[380px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
            {/* Left Configuration Column */}
            <div className="divide-y divide-slate-200">
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-slate-900">
                  {activePlatform.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{activePlatform.targetModels}</p>
                <p className="mt-2 text-xs text-slate-600">{activePlatform.charBudgetNote}</p>

                <ol className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-700">
                  {activePlatform.steps.map((step, idx) => (
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
                    <option value="high_rate">Lock: High Interest Rate / Inflation (40/15/20/15/10)</option>
                    <option value="bull_growth">Lock: Bull Growth Regime (20/35/20/15/10)</option>
                    <option value="stagflation">Lock: Recessionary / Stagflation (45/10/25/10/10)</option>
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
                      Requires chatbot to verify weight sums and exact W_i * S_i products before
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
                      Anti-Hallucination EDGAR Guardrail
                    </strong>
                    <span className="block text-slate-500">
                      Zero-fills missing alt-data feeds instead of allowing speculative estimates.
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
                    {activePlatform.filename}
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
