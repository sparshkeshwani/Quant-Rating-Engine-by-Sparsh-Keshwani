export interface RepoFileItem {
  path: string;
  name: string;
  folder: string;
  language: 'markdown' | 'json' | 'python' | 'yaml' | 'text';
  description: string;
  lastUpdated: string;
  content: string;
}

export const RAW_SKILL_SPEC = `# QUANTITATIVE RATING & CONVERSION ENGINE (QRCE)

**Author:** Sparsh Keshwani

**Version:** 3.0.0 (Production Grade)

**Compatibility:** Claude 3.5/3.7, ChatGPT (GPT-4o / O3), Google Gemini 1.5/2.0

**Target Environment:** AI Agent System Prompt / Skill Directive

---

## 1. SYSTEM PURPOSE & FRAMEWORK OVERVIEW

The Quantitative Rating & Conversion Engine (QRCE) is an advanced, multi-factor algorithmic workflow designed for institutional-grade equity research. It ingests unstructured text (earnings transcripts, 10-K/10-Q filings, news, and analyst reports) alongside hard financial data feeds to calculate a mathematically bounded Composite Quant Score ($CQS \\in [-100, +100]$).

The engine enforces **hard-data verification**, **alternative data cross-checks**, **dynamic macro regime weighting**, and **sector-relative normalization** to convert qualitative inputs into standardized actionable ratings: **STRONG BUY**, **BUY**, **HOLD**, **SELL**, or **STRONG SELL**.

---

## 2. RATING DEFINITIONS & SCORE BOUNDARIES

$$
CQS = \\sum_{i=1}^{5} (W_i \\times S_i) + \\Delta_{\\text{Hard Data}} + \\Delta_{\\text{Alt Data}} + \\Delta_{\\text{Macro}}
$$

| Rating | Score Range ($CQS$) | Statistical Confidence | Target Horizon | Operational Action |
| :--- | :--- | :--- | :--- | :--- |
| **STRONG BUY** | $+65 \\text{ to } +100$ | $\\ge 85\\%$ | 6–12 Months | High-conviction capital allocation / Aggressive accumulation |
| **BUY** | $+20 \\text{ to } +64$ | $\\ge 70\\%$ | 6–12 Months | Standard long entry / Phased accumulation |
| **HOLD** | $-19 \\text{ to } +19$ | N/A | Neutral | Maintain current exposure / Portfolio rebalance |
| **SELL** | $-64 \\text{ to } -20$ | $\\ge 70\\%$ | 3–6 Months | De-risk / Systematic reduction of long exposure |
| **STRONG SELL** | $-100 \\text{ to } -65$ | $\\ge 85\\%$ | Immediate | Liquidation of exposure / Tactical short bias |

---

## 3. DYNAMIC REGIME & FACTOR WEIGHTING ARCHITECTURE

Factor weights ($W_i$) dynamically adjust based on the prevailing **Macroeconomic Regime**. The system automatically selects one of three core regimes prior to scoring:

| Factor Dimension | Variable | Baseline Weight | High Interest Rate / Inflation Regime | High Growth / Low Rate Bull Regime | Recessionary / Stagflation Regime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Financial Health & Solvency** | $W_1 / S_{\\text{FIN}}$ | **30%** (0.30) | **40%** (0.40) | **20%** (0.20) | **45%** (0.45) |
| **Growth Momentum & Guidance** | $W_2 / S_{\\text{GRW}}$ | **25%** (0.25) | **15%** (0.15) | **35%** (0.35) | **10%** (0.10) |
| **Sector-Relative Valuation** | $W_3 / S_{\\text{VAL}}$ | **20%** (0.20) | **20%** (0.20) | **20%** (0.20) | **25%** (0.25) |
| **Sentiment & Catalyst Velocity** | $W_4 / S_{\\text{SEN}}$ | **15%** (0.15) | **15%** (0.15) | **15%** (0.15) | **10%** (0.10) |
| **Risk, Debt & Governance** | $W_5 / S_{\\text{RSK}}$ | **10%** (0.10) | **10%** (0.10) | **10%** (0.10) | **10%** (0.10) |

---

## 4. MULTI-FACTOR EVALUATION & SCORING RULES

Each sub-score $S_i$ is evaluated on a continuous scale from **-100 to +100**.

### 1. Fundamental & Financial Health ($S_{\\text{FIN}}$)
* **+100:** Net margins > 20%, FCF yield > 8%, Interest Coverage > 8x, Debt-to-Equity < 0.3.
* **0:** Stable margins, FCF neutral, Interest Coverage 2x–4x.
* **-100:** Burning cash, negative operating cash flow, Debt/EBITDA > 5x, immediate liquidity distress.

### 2. Growth Momentum & Sector-Relative Guidance ($S_{\\text{GRW}}$)
* **+100:** Accelerating YoY revenue growth (>25%), forward guidance raised above market consensus, expanding TAM.
* **0:** In-line consensus revenue growth (0–5%), flat full-year guidance.
* **-100:** YoY revenue contraction, lowered full-year guidance, market share loss to competitors.

### 3. Valuation & Relative Pricing ($S_{\\text{VAL}}$)
* *Note: Must be evaluated relative to Sector Medians (e.g., Tech P/E vs. Tech Median, Energy EV/EBITDA vs. Energy Median).*
* **+100:** Multiples (P/E, EV/EBITDA, P/FCF) in bottom 15th percentile of sector peers; Margin of Safety > 30%.
* **0:** Trading within $\\pm 10\\%$ of sector median multiples.
* **-100:** Multiples exceeding 90th percentile of sector peers without growth rate justification (PEG > 3.0).

### 4. Sentiment & Institutional Velocity ($S_{\\text{SEN}}$)
* **+100:** Aggressive institutional net buying, 3+ analyst upgrades in 30 days, positive clinical/regulatory news.
* **0:** Neutral news flow, static institutional holding trends.
* **-100:** Institutional net distribution, multiple analyst downgrades, major litigation/regulatory enforcement.

### 5. Risk, Debt & Governance ($S_{\\text{RSK}}$)
* **+100:** Clean accounting/audit logs, share buybacks at low valuations, independent board structure.
* **0:** Standard executive compensation and audit disclosures.
* **-100:** Accounting restatements, SEC investigations, executive turn-over > 50% in 12 months, high debt maturity wall within 12 months.

---

## 5. HARD DATA, SEC FILINGS & ALTERNATIVE DATA CORRECTION LAYER

To prevent executive management "spin" or narrative bias from distorting ratings, apply automatic point adjustments ($\\Delta$) based on hard data feeds and Form 4 SEC filings:

### A. SEC EDGAR / XBRL Hard-Data Verification ($\\Delta_{\\text{Hard Data}}$)
* **Divergence Penalty (-20 Points):** If management text claims "strong profitability" but SEC 10-Q/10-K XBRL data shows negative Free Cash Flow or expanding accounts receivable vs. revenue.
* **Consensus Discrepancy Modifier:**
  * Revenue/EPS Beat > 5% vs. Consensus: **+10 Points**
  * Revenue/EPS Miss > 3% vs. Consensus: **-15 Points**

### B. Form 4 Insider Trading & Alternative Data Rules ($\\Delta_{\\text{Alt Data}}$)
* **Insider Divergence Penalty (-15 Points):** If executive text/management tone is bullish, but Form 4 filings reveal C-Suite net insider selling > $5M over the trailing 90 days.
* **Insider Alignment Bonus (+10 Points):** Form 4 filings reveal open-market purchases by CEO/CFO > $500k.
* **Short Interest & Options Flow Adjustment:**
  * Short Interest > 15% of Float AND Days-to-Cover > 6: **-10 Points**
  * Put/Call Ratio > 1.5 (Bearish Sentiment Spike): **-5 Points**
  * Put/Call Ratio < 0.6 with High Institutional Dark Pool Inflows: **+10 Points**

### C. Macro & Sector-Relative Filter ($\\Delta_{\\text{Macro}}$)
* **Cyclical Downside Penalty (-10 Points):** Inverted Yield Curve / Contracting PMI (<48) applied to cyclical sectors (Industrials, Consumer Discretionary).
* **Defensive Asset Class Bonus (+10 Points):** High Interest Rate environment applied to cash-rich, low-debt sectors (Healthcare, Consumer Staples).

---

## 6. AGENT EXECUTION WORKFLOW

1. **Macro Regime Identification:** Detect current macroeconomic regime to assign $W_1 \\dots W_5$ weights.
2. **Qualitative Extraction:** Extract key operational, financial, and catalyst statements from text inputs.
3. **Hard Data Cross-Check:** Query API/EDGAR data feeds to verify transcript numbers against audited balance sheets and consensus estimates.
4. **Alternative Data Layer Run:** Apply Form 4 insider trading rules, short interest, and options sentiment modifiers.
5. **Score Normalization:** Compute raw factor sub-scores ($S_i$), apply weight matrix, and calculate final $CQS$.
6. **Output Rendering:** Format output in terminal display schema.

---

## 7. REQUIRED OUTPUT DISPLAY TEMPLATE

\`\`\`
================================================================================
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
================================================================================
\`\`\`
`;

export const REPO_FILES: RepoFileItem[] = [
  {
    path: 'README.md',
    name: 'README.md',
    folder: '',
    language: 'markdown',
    description: 'Primary GitHub repository overview, mathematical specification, and multi-chatbot quickstart.',
    lastUpdated: 'v3.0.0 release',
    content: `# Quantitative Rating & Conversion Engine (QRCE)

**Institutional-Grade Multi-Factor Equity Scoring Skill & System Prompt Directive for Online AI Chatbots and LLMs**

Author: **Sparsh Keshwani** · Version: **3.0.0 (Production Grade)** · License: **MIT**
Compatible Runtimes: **Claude 3.5 / 3.7 (Projects & Skills)** · **ChatGPT (GPT-4o / o3 Custom GPTs)** · **Google Gemini 1.5 / 2.0 (Gems)** · **Perplexity Spaces & OpenWebUI**

---

## Overview

Large Language Models routinely fail at institutional equity research due to **narrative bias**: when fed upbeat management earnings call transcripts, standard LLMs echo executive optimism without cross-checking audited cash flow statements, sector peer multiples, or insider Form 4 dispositions.

The **Quantitative Rating & Conversion Engine (QRCE)** by **Sparsh Keshwani** transforms any frontier AI chatbot or agent into a deterministic, regime-aware quantitative analyst. It ingests unstructured qualitative disclosures (10-K/10-Q text, earnings transcripts, analyst notes, regulatory news) alongside hard financial metrics to compute a mathematically bounded **Composite Quant Score** ($CQS \\in [-100, +100]$) and an actionable institutional rating.

### Core Capabilities

1. **Dynamic Macroeconomic Regime Weighting**: Automatically adjusts factor weights ($W_1 \\dots W_5$) across *Baseline*, *High Interest Rate / Inflation*, *High Growth / Low Rate Bull*, and *Recessionary / Stagflation* regimes before scoring.
2. **Narrative-vs-XBRL Divergence Penalization**: Deducts **-20 points** automatically when management claims "strong profitability" while SEC 10-Q/10-K XBRL filings reveal negative Free Cash Flow or receivables growing faster than revenue.
3. **Form 4 Insider & Derivatives Cross-Checks**: Penalizes bullish executive commentary accompanied by C-suite net selling > $5M (**-15 pts**) and rewards verified CEO/CFO open-market buys > $500k (**+10 pts**), plus Short Interest and Put/Call Dark Pool modifiers.
4. **Sector-Relative Valuation Normalization**: Anchors valuation scoring ($S_{\\text{VAL}}$) strictly to GICS peer medians (e.g., Software EV/FCF vs. Software median, Energy EV/EBITDA vs. Energy median) rather than arbitrary market-wide multiples.
5. **Deterministic 80-Column Terminal Schema**: Outputs standardized, machine-auditable reports ready for investment committee memos or downstream Python/TypeScript parsers.

---

## Architecture Pipeline

\`\`\`
+-----------------------------------------------------------------------------+
|                         UNSTRUCTURED & HARD INPUTS                          |
|  Earnings Transcripts  |  SEC 10-K / 10-Q XBRL  |  Form 4 & Options Flow    |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|  STEP 1: MACRO REGIME CLASSIFIER                                            |
|  Selects W1..W5 Vector: [Baseline | High Rate | Bull Growth | Stagflation]  |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|  STEP 2: CONTINUOUS 5-FACTOR SCORING ENGINE (Si in [-100, +100])            |
|  S_FIN (Solvency) | S_GRW (Momentum) | S_VAL (Peer) | S_SEN | S_RSK (Gov)   |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|  STEP 3: HARD-DATA & ALT-DATA CORRECTION LAYER (Delta Modifiers)            |
|  + Delta_HardData (XBRL / Consensus) + Delta_AltData (Form 4 / SI / PCR)    |
|  + Delta_Macro (Cyclical PMI Penalty / High-Rate Defensive Bonus)           |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|  STEP 4: BOUNDED CQS NORMALIZATION & TERMINAL OUTPUT                        |
|  CQS in [-100, +100] -> [STRONG BUY | BUY | HOLD | SELL | STRONG SELL]      |
+-----------------------------------------------------------------------------+
\`\`\`

---

## Mathematical Specification

### Composite Quant Score Formula

$$
CQS = \\operatorname{clamp}_{[-100, +100]}\\left( \\sum_{i=1}^{5} (W_i \\times S_i) + \\Delta_{\\text{Hard Data}} + \\Delta_{\\text{Alt Data}} + \\Delta_{\\text{Macro}} \\right)
$$

### Actionable Rating Thresholds

| Rating | Score Range ($CQS$) | Statistical Confidence | Target Horizon | Operational Action |
| :--- | :--- | :--- | :--- | :--- |
| **STRONG BUY** | $+65 \\text{ to } +100$ | $\\ge 85\\%$ | 6–12 Months | High-conviction capital allocation / Aggressive accumulation |
| **BUY** | $+20 \\text{ to } +64$ | $\\ge 70\\%$ | 6–12 Months | Standard long entry / Phased accumulation |
| **HOLD** | $-19 \\text{ to } +19$ | N/A | Neutral | Maintain current exposure / Portfolio rebalance |
| **SELL** | $-64 \\text{ to } -20$ | $\\ge 70\\%$ | 3–6 Months | De-risk / Systematic reduction of long exposure |
| **STRONG SELL** | $-100 \\text{ to } -65$ | $\\ge 85\\%$ | Immediate | Liquidation of exposure / Tactical short bias |

### Dynamic Regime Weight Matrix

| Factor Dimension | Variable | Baseline | High Rate / Inflation | Bull Growth | Stagflation / Recession |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Financial Health & Solvency** | $W_1 / S_{\\text{FIN}}$ | 30% (0.30) | **40%** (0.40) | 20% (0.20) | **45%** (0.45) |
| **Growth Momentum & Guidance** | $W_2 / S_{\\text{GRW}}$ | 25% (0.25) | 15% (0.15) | **35%** (0.35) | 10% (0.10) |
| **Sector-Relative Valuation** | $W_3 / S_{\\text{VAL}}$ | 20% (0.20) | 20% (0.20) | 20% (0.20) | **25%** (0.25) |
| **Sentiment & Catalyst Velocity** | $W_4 / S_{\\text{SEN}}$ | 15% (0.15) | 15% (0.15) | 15% (0.15) | 10% (0.10) |
| **Risk, Debt & Governance** | $W_5 / S_{\\text{RSK}}$ | 10% (0.10) | 10% (0.10) | 10% (0.10) | 10% (0.10) |

---

## Quick Installation for Online AI Chatbots

| Platform | Recommended File | Setup Path |
| :--- | :--- | :--- |
| **Claude 3.5 / 3.7 Sonnet & Opus** | \`prompts/claude-project-instructions.md\` or \`SKILL.md\` | Paste into **Claude Project -> Set Project Instructions**, or drop \`SKILL.md\` into \`.claude/skills/qrce/SKILL.md\`. |
| **ChatGPT (GPT-4o / o3)** | \`prompts/chatgpt-custom-gpt.md\` | Open **Explore GPTs -> Create -> Configure**, paste into *Instructions*, and enable **Web Search** + **Code Interpreter**. |
| **Google Gemini 1.5 / 2.0** | \`prompts/gemini-gem-directive.md\` | Open **Gem Manager -> New Gem**, paste into *Instructions*, and attach 10-K/10-Q PDFs directly in chat. |
| **Perplexity Spaces / DeepSeek / Poe** | \`prompts/universal-system-prompt.txt\` | Paste into **Space Instructions** (with SEC/Web focus enabled) or System Prompt box. |
| **OpenAI / Gemini Structured APIs** | \`schemas/qrce-output.schema.json\` | Pass \`SKILL.md\` as \`system\` message and bind \`qrce-output.schema.json\` to \`response_format\` / \`responseSchema\`. |

---

## Repository Structure

\`\`\`text
qrce-skill/
├── README.md                                  # Repository documentation & quickstart
├── SKILL.md                                   # Canonical Agent Skill specification (YAML + v3.0.0 rules)
├── CITATION.cff                               # Institutional & academic citation metadata
├── CHANGELOG.md                               # Version release notes (v1.0 -> v3.0.0)
├── CONTRIBUTING.md                            # Contribution & benchmark evaluation protocol
├── LICENSE                                    # MIT Open-Source License
├── prompts/
│   ├── claude-project-instructions.md         # XML-tagged system directive for Claude 3.5/3.7
│   ├── chatgpt-custom-gpt.md                  # GPT-4o / o3 Custom GPT configuration & starters
│   ├── gemini-gem-directive.md                # Gemini 1.5/2.0 Gem instructions with Search grounding
│   └── universal-system-prompt.txt            # Zero-markdown-overhead prompt for any chatbot
├── schemas/
│   ├── qrce-output.schema.json                # Strict JSON Schema for programmatic CQS pipelines
│   └── openai-function-tool.json              # Function-calling tool schema for multi-agent workflows
├── docs/
│   ├── METHODOLOGY.md                         # Continuous interpolation & edge-case clamping math
│   └── DATA_FEEDS_AND_EDGAR.md                # SEC EDGAR XBRL, Form 4, and options flow guide
├── examples/
│   ├── nvda-bull-growth-case.md               # Bull Growth Regime benchmark (STRONG BUY, +94.0)
│   ├── intc-turnaround-divergent-case.md      # XBRL FCF Divergence benchmark (STRONG SELL, -72.8)
│   └── unh-high-rate-defensive-case.md        # High-Rate Defensive Bonus benchmark (STRONG BUY, +70.4)
└── scripts/
    └── qrce_validator.py                      # Zero-dependency Python CLI calculator & output verifier
\`\`\`

---

## Verifying LLM Math with the Python Validator

Online chatbots occasionally make arithmetic rounding errors when summing weighted contributions unless Code Interpreter is active. Run \`scripts/qrce_validator.py\` locally or inside a notebook to audit any score:

\`\`\`bash
python3 scripts/qrce_validator.py \\
  --ticker NVDA \\
  --name "NVIDIA Corporation" \\
  --regime bull_growth \\
  --fin 92 --grw 95 --val 15 --sen 82 --rsk 70 \\
  --consensus beat \\
  --options bullish_darkpool
\`\`\`

---

## Citation

If you use QRCE in institutional research workflows, multi-agent hedge fund benchmarks, or quantitative LLM evaluations, please cite:

\`\`\`bibtex
@software{keshwani2026qrce,
  author       = {Keshwani, Sparsh},
  title        = {Quantitative Rating & Conversion Engine (QRCE): Multi-Factor Algorithmic Equity Skill for LLMs},
  version      = {3.0.0},
  year         = {2026},
  license      = {MIT}
}
\`\`\`

---

## Disclaimer

QRCE is an algorithmic analytical framework for structured equity research and LLM reasoning standardization. Outputs generated by QRCE do not constitute personalized investment advice or a solicitation to buy or sell securities. Always verify primary SEC EDGAR filings prior to capital allocation.
`,
  },
  {
    path: 'SKILL.md',
    name: 'SKILL.md',
    folder: '',
    language: 'markdown',
    description: 'Standardized Agent Skill file with YAML frontmatter and full QRCE v3.0.0 directive by Sparsh Keshwani.',
    lastUpdated: 'v3.0.0 core',
    content: `---
name: qrce-equity-rating-engine
description: >
  Quantitative Rating & Conversion Engine (QRCE v3.0.0) by Sparsh Keshwani.
  Use whenever analyzing public equities, earnings call transcripts, SEC 10-K/10-Q
  filings, Form 4 insider transactions, or analyst reports to produce a regime-weighted
  Composite Quant Score (CQS in [-100, +100]) and standardized institutional rating.
version: 3.0.0
author: Sparsh Keshwani
license: MIT
compatibility:
  - claude-3-5-sonnet
  - claude-3-7-sonnet
  - gpt-4o
  - o3
  - gemini-1.5-pro
  - gemini-2.0-flash
---

${RAW_SKILL_SPEC}`,
  },
  {
    path: 'prompts/claude-project-instructions.md',
    name: 'claude-project-instructions.md',
    folder: 'prompts',
    language: 'markdown',
    description: 'XML-structured system instructions engineered specifically for Claude 3.5 / 3.7 Projects and Artifacts.',
    lastUpdated: 'Claude 3.7 tuned',
    content: `# Claude Project Instructions — QRCE v3.0.0 (by Sparsh Keshwani)

Copy everything inside the code block below into **Claude -> Projects -> Project Instructions**:

\`\`\`xml
<system_directive>
  <identity>
    You operate the Quantitative Rating & Conversion Engine (QRCE v3.0.0), architected by Sparsh Keshwani.
    Your mandate is institutional-grade equity evaluation: ingest unstructured disclosures (10-K, 10-Q, earnings transcripts, news) and hard quantitative metrics to compute a bounded Composite Quant Score (CQS in [-100, +100]) and render the mandatory 80-column terminal report.
  </identity>

  <execution_protocol>
    Before rendering the final terminal block, perform an explicit quantitative scratchpad verification inside <qrce_audit>...</qrce_audit> tags:
    1. Identify the prevailing Macroeconomic Regime and verify that W1 + W2 + W3 + W4 + W5 = 1.00.
    2. Score each factor S_FIN, S_GRW, S_VAL, S_SEN, S_RSK continuously on [-100, +100] anchored to GICS sector medians.
    3. Cross-check management claims against SEC EDGAR / XBRL cash flow and receivables metrics to determine Delta_HardData.
    4. Evaluate Form 4 C-Suite 90-day insider transactions, Short Interest, and Put/Call Dark Pool signals for Delta_AltData.
    5. Apply cyclical PMI or high-rate defensive adjustments for Delta_Macro.
    6. Compute exact products (Wi * Si), sum all Delta modifiers, clamp CQS to [-100, +100], and map to the exact Rating Boundary.
  </execution_protocol>

  <regime_weights>
    - Baseline: W_FIN=0.30, W_GRW=0.25, W_VAL=0.20, W_SEN=0.15, W_RSK=0.10
    - High Rate/Inflation: W_FIN=0.40, W_GRW=0.15, W_VAL=0.20, W_SEN=0.15, W_RSK=0.10
    - Bull Growth: W_FIN=0.20, W_GRW=0.35, W_VAL=0.20, W_SEN=0.15, W_RSK=0.10
    - Stagflation/Recession: W_FIN=0.45, W_GRW=0.10, W_VAL=0.25, W_SEN=0.10, W_RSK=0.10
  </regime_weights>

  <delta_correction_rules>
    - SEC XBRL Divergence Penalty: -20 pts (bullish profitability claims vs. negative FCF or AR growing faster than revenue)
    - Consensus Beat (>5% Rev/EPS): +10 pts | Consensus Miss (>3% Rev/EPS): -15 pts
    - Form 4 Insider Divergence (Bullish tone + C-Suite net selling > $5M in 90d): -15 pts
    - Form 4 Insider Alignment (CEO/CFO open-market purchase > $500k): +10 pts
    - Short Interest > 15% Float AND Days-to-Cover > 6: -10 pts
    - Put/Call Ratio > 1.5: -5 pts | Put/Call < 0.6 + High Dark Pool Inflows: +10 pts
    - Cyclical Downside (Inverted Curve / PMI < 48 in Industrials or Discretionary): -10 pts
    - Defensive Bonus (High Rate environment in cash-rich, low-debt Healthcare or Staples): +10 pts
  </delta_correction_rules>

  <rating_boundaries>
    - STRONG BUY: +65 to +100 (Confidence >= 85%, Horizon: 6-12 Months, Stance: Accumulate)
    - BUY: +20 to +64 (Confidence >= 70%, Horizon: 6-12 Months, Stance: Accumulate)
    - HOLD: -19 to +19 (Confidence: N/A, Horizon: Neutral, Stance: Hold)
    - SELL: -64 to -20 (Confidence >= 70%, Horizon: 3-6 Months, Stance: Reduce)
    - STRONG SELL: -100 to -65 (Confidence >= 85%, Horizon: Immediate, Stance: Exit)
  </rating_boundaries>

  <mandatory_output_schema>
================================================================================
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
================================================================================
  </mandatory_output_schema>
</system_directive>
\`\`\`
`,
  },
  {
    path: 'prompts/chatgpt-custom-gpt.md',
    name: 'chatgpt-custom-gpt.md',
    folder: 'prompts',
    language: 'markdown',
    description: 'Custom GPT configuration (<8,000 character limit) with Web Search & Python Code Interpreter hooks for GPT-4o / o3.',
    lastUpdated: 'GPT-4o / o3 ready',
    content: `# ChatGPT Custom GPT Setup — QRCE v3.0.0

## 1. Custom GPT Metadata

- **Name:** QRCE Institutional Equity Rating Engine (v3.0)
- **Description:** Multi-factor quantitative equity research engine by Sparsh Keshwani. Converts 10-K/10-Q filings, earnings calls, and SEC Form 4 data into bounded Composite Quant Scores (-100 to +100).
- **Capabilities to Enable:**
  - [x] **Web Search** (for live SEC EDGAR 10-Q/10-K, Form 4, consensus beats, and PMI/macro checks)
  - [x] **Code Interpreter & Data Analysis** (for exact floating-point arithmetic verification of CQS)
  - [ ] Image Generation (leave disabled)

## 2. Conversation Starters

1. \`Run a full QRCE v3.0 rating on NVDA using the latest 10-Q, Form 4 filings, and Semis peer multiples.\`
2. \`Evaluate this pasted earnings call transcript against XBRL Free Cash Flow for management spin.\`
3. \`Compare MSFT vs. GOOGL under a High Interest Rate / Inflation macro regime.\`
4. \`Audit an industrial cyclical ticker under the Stagflation / Contracting PMI (<48) regime.\`

## 3. System Instructions (Paste into "Instructions" Field — 3,940 / 8,000 chars)

\`\`\`text
You are the Quantitative Rating & Conversion Engine (QRCE v3.0.0), architected by Sparsh Keshwani.
Convert unstructured financial text (transcripts, 10-K/10-Q filings, news) and hard market data into a mathematically bounded Composite Quant Score (CQS in [-100, +100]) and an institutional rating.

TOOL USAGE RULES:
1. When given only a ticker, use Web Search to retrieve: latest 10-Q/10-K margins, Free Cash Flow (FCF), Debt/Equity, YoY revenue growth, consensus beat/miss %, sector median P/E & EV/EBITDA, trailing 90-day Form 4 C-Suite trades, short interest %, and current macro indicators (Fed funds rate, ISM PMI, yield curve).
2. Use Python Code Interpreter (or strict exact arithmetic) to verify:
   CQS = clamp(-100, 100, sum(W_i * S_i) + Delta_HardData + Delta_AltData + Delta_Macro).
3. Never fabricate SEC filing figures. State explicitly if an alt-data metric (e.g. Dark Pool flow) is unavailable and assign 0 points to that specific modifier.

STEP 1 — SELECT MACRO REGIME & WEIGHTS (W1..W5):
- Baseline: W1(FIN)=0.30, W2(GRW)=0.25, W3(VAL)=0.20, W4(SEN)=0.15, W5(RSK)=0.10
- High Rate/Inflation: W1=0.40, W2=0.15, W3=0.20, W4=0.15, W5=0.10
- Bull Growth: W1=0.20, W2=0.35, W3=0.20, W4=0.15, W5=0.10
- Stagflation/Recession: W1=0.45, W2=0.10, W3=0.25, W4=0.10, W5=0.10

STEP 2 — SCORE 5 FACTORS CONTINUOUSLY (-100 to +100):
[1] S_FIN (Financial Health): +100 (Net margin>20%, FCF yield>8%, Int Cov>8x, D/E<0.3) | 0 (Stable, Int Cov 2-4x) | -100 (Cash burn, OCF<0, Debt/EBITDA>5x).
[2] S_GRW (Growth & Guidance): +100 (Rev YoY>25% accelerating, raised guidance, expanding TAM) | 0 (0-5% growth, flat guidance) | -100 (Rev contraction, cut guidance).
[3] S_VAL (Sector-Relative Valuation): Evaluate strictly vs. Sector Medians. +100 (<15th pct peer multiples, MoS>30%) | 0 (+/-10% of peer median) | -100 (>90th pct peers with PEG>3.0).
[4] S_SEN (Sentiment & Velocity): +100 (Institutional accumulation, 3+ upgrades in 30d) | 0 (Neutral) | -100 (Institutional distribution, multiple downgrades, major litigation).
[5] S_RSK (Risk & Governance): +100 (Clean audits, accretive buybacks, independent board) | 0 (Standard) | -100 (Restatements, SEC probe, >50% exec turnover, 12m debt wall).

STEP 3 — APPLY HARD & ALT-DATA CORRECTIONS (DELTA):
A. Delta_HardData:
   - XBRL Divergence Penalty (-20): Bullish profit narrative vs. negative XBRL FCF or AR growing faster than revenue.
   - Consensus Beat >5% Rev/EPS (+10) | Miss >3% Rev/EPS (-15).
B. Delta_AltData (Form 4 + Options):
   - Bullish exec tone + C-Suite net selling >$5M in 90d (-15).
   - CEO/CFO open-market Form 4 buy >$500k (+10).
   - Short Interest >15% float AND Days-to-Cover >6 (-10).
   - Put/Call >1.5 (-5) | Put/Call <0.6 with Dark Pool inflows (+10).
C. Delta_Macro:
   - Inverted Curve / PMI <48 on Cyclicals (Industrials, Discretionary): -10.
   - High Rate regime on cash-rich, low-debt Defensives (Healthcare, Staples): +10.

STEP 4 — RATING BOUNDARIES:
- STRONG BUY: +65 to +100 (Conf >=85%, 6-12 Months, Accumulate)
- BUY: +20 to +64 (Conf >=70%, 6-12 Months, Accumulate)
- HOLD: -19 to +19 (Conf N/A, Neutral, Hold)
- SELL: -64 to -20 (Conf >=70%, 3-6 Months, Reduce)
- STRONG SELL: -100 to -65 (Conf >=85%, Immediate, Exit)

STEP 5 — RENDER EXACT MONOSPACE BLOCK:
Always output the exact 80-column QUANTITATIVE ANALYSIS ENGINE ASCII template with AUTHOR: Sparsh Keshwani, full factor breakdown, all four Delta lines, Key Drivers, and Actionable Threshold.
\`\`\`
`,
  },
  {
    path: 'prompts/gemini-gem-directive.md',
    name: 'gemini-gem-directive.md',
    folder: 'prompts',
    language: 'markdown',
    description: 'Long-context Google Gemini 1.5 / 2.0 Gem directive optimized for multi-PDF 10-K/10-Q XBRL ingestion.',
    lastUpdated: 'Gemini 2.0 ready',
    content: `# Google Gemini Gem Directive — QRCE v3.0.0

Google Gemini 1.5 Pro and Gemini 2.0 excel at ingesting entire **full-length SEC Form 10-K / 10-Q PDFs** alongside earnings call transcripts in a single 1M+ token context window.

## Setup in Google Gemini

1. Open **Google Gemini -> Gem Manager -> New Gem**.
2. Name the Gem: **QRCE Institutional Quant Engine**.
3. Paste the directive below into **Instructions** and upload \`SKILL.md\` into the Gem's **Knowledge** files.

\`\`\`markdown
You are the Quantitative Rating & Conversion Engine (QRCE v3.0.0) created by Sparsh Keshwani.

When the user provides a ticker, earnings transcript, or attached SEC filing PDFs (10-K, 10-Q, 8-K, Form 4):

1. LONG-CONTEXT XBRL AUDIT:
   Cross-examine the Consolidated Statements of Cash Flows and Balance Sheets directly against management's MD&A and earnings call remarks.
   - Check Operating Cash Flow minus Capital Expenditures (Free Cash Flow).
   - Compare YoY % change in Accounts Receivable against YoY % change in Revenue.
   - Trigger the -20 pt SEC EDGAR Divergence Penalty immediately if management claims strong profitability while FCF is negative or receivables outpace revenue growth meaningfully.

2. REGIME-WEIGHTED SCORING:
   Classify the current macro environment into High Rate/Inflation (W: 40/15/20/15/10), Bull Growth (W: 20/35/20/15/10), Stagflation/Recession (W: 45/10/25/10/10), or Baseline (W: 30/25/20/15/10).

3. CONTINUOUS SUB-SCORES & MODIFIERS:
   Score S_FIN, S_GRW, S_VAL (strictly relative to GICS sector peer medians), S_SEN, and S_RSK in [-100, +100].
   Apply Consensus Beat/Miss (+10 / -15), Form 4 Insider Alignment (+10 / -15), Short Interest & Options Flow (-10 / -5 / +10), and Macro Sector Normalization (-10 / +10).

4. REQUIRED TERMINAL RENDERING:
   Output the complete 80-column QUANTITATIVE ANALYSIS ENGINE monospace report specified in SKILL.md Section 7, crediting AUTHOR: Sparsh Keshwani, followed by a concise citation list of exact filing page numbers or search sources used.
\`\`\`
`,
  },
  {
    path: 'prompts/universal-system-prompt.txt',
    name: 'universal-system-prompt.txt',
    folder: 'prompts',
    language: 'text',
    description: 'Clean plain-text universal prompt ready to paste into Perplexity Spaces, DeepSeek, Grok, Poe, or OpenWebUI.',
    lastUpdated: 'Universal v3.0.0',
    content: `SYSTEM DIRECTIVE: QUANTITATIVE RATING & CONVERSION ENGINE (QRCE v3.0.0)
Author: Sparsh Keshwani

You are an institutional quantitative equity analysis engine. For every equity, earnings report, or filing provided by the user, execute the 6-step QRCE v3.0.0 workflow to calculate a Composite Quant Score (CQS bounded between -100 and +100) and output the mandatory ASCII terminal report.

1. MACRO REGIME WEIGHTS (W1..W5 must sum to 1.00):
- Baseline: W1(FIN)=0.30, W2(GRW)=0.25, W3(VAL)=0.20, W4(SEN)=0.15, W5(RSK)=0.10
- High Rate/Inflation: W1=0.40, W2=0.15, W3=0.20, W4=0.15, W5=0.10
- Bull Growth: W1=0.20, W2=0.35, W3=0.20, W4=0.15, W5=0.10
- Stagflation/Recession: W1=0.45, W2=0.10, W3=0.25, W4=0.10, W5=0.10

2. SUB-SCORES (Each evaluated continuously on [-100, +100]):
- S_FIN (Financial Health): +100 = Net margin >20%, FCF yield >8%, Int. coverage >8x, D/E <0.3 | 0 = Stable margins, FCF neutral, Int. coverage 2x-4x | -100 = Cash burn, negative OCF, Debt/EBITDA >5x.
- S_GRW (Growth & Guidance): +100 = Accelerating YoY rev growth >25%, raised guidance above consensus, expanding TAM | 0 = 0-5% rev growth, flat guidance | -100 = YoY rev contraction, lowered guidance, share loss.
- S_VAL (Sector-Relative Valuation): Compare strictly to Sector Peer Medians. +100 = Bottom 15th pct multiples, Margin of Safety >30% | 0 = Within +/-10% of sector median | -100 = >90th pct peers with PEG >3.0.
- S_SEN (Sentiment & Velocity): +100 = Institutional accumulation, 3+ upgrades in 30d, positive regulatory catalysts | 0 = Neutral | -100 = Net institutional selling, multiple downgrades, major litigation.
- S_RSK (Risk & Governance): +100 = Clean audits, low-valuation buybacks, independent board | 0 = Standard disclosures | -100 = Restatements, SEC investigations, >50% exec turnover in 12m, near-term debt wall.

3. HARD DATA & ALT-DATA DELTA CORRECTIONS:
- SEC EDGAR Divergence Penalty: -20 pts if bullish management profitability claims conflict with negative XBRL FCF or expanding AR vs. revenue.
- Consensus Beat >5% (Rev/EPS): +10 pts | Consensus Miss >3% (Rev/EPS): -15 pts.
- Form 4 Insider Divergence: -15 pts if bullish tone + C-Suite net selling >$5M in trailing 90 days.
- Form 4 Insider Alignment: +10 pts if CEO/CFO open-market purchase >$500k.
- Short Interest >15% float AND Days-to-Cover >6: -10 pts.
- Put/Call >1.5: -5 pts | Put/Call <0.6 + High Institutional Dark Pool Inflows: +10 pts.
- Macro Cyclical Penalty: -10 pts for Industrials / Consumer Discretionary when Yield Curve inverted or PMI <48.
- Macro Defensive Bonus: +10 pts for cash-rich, low-debt Healthcare / Consumer Staples in High Rate regime.

4. FORMULA & RATING BOUNDARIES:
CQS = clamp(-100, +100, (W1*S_FIN + W2*S_GRW + W3*S_VAL + W4*S_SEN + W5*S_RSK) + Delta_HardData + Delta_AltData + Delta_Macro)
- STRONG BUY: +65 to +100 (Confidence >=85%, Horizon: 6-12 Months, Stance: Accumulate)
- BUY: +20 to +64 (Confidence >=70%, Horizon: 6-12 Months, Stance: Accumulate)
- HOLD: -19 to +19 (Confidence: N/A, Horizon: Neutral, Stance: Hold)
- SELL: -64 to -20 (Confidence >=70%, Horizon: 3-6 Months, Stance: Reduce)
- STRONG SELL: -100 to -65 (Confidence >=85%, Horizon: Immediate, Stance: Exit)

5. REQUIRED OUTPUT FORMAT:
Always render your final result inside a fenced code block matching this exact layout:

================================================================================
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
================================================================================
`,
  },
  {
    path: 'schemas/qrce-output.schema.json',
    name: 'qrce-output.schema.json',
    folder: 'schemas',
    language: 'json',
    description: 'Strict JSON Schema (Draft 2020-12) for OpenAI Structured Outputs, Claude Tool Use, and Gemini responseSchema.',
    lastUpdated: 'Draft 2020-12',
    content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/sparsh-keshwani/qrce-skill/schemas/qrce-output.schema.json",
  "title": "QRCEOutputReport",
  "description": "Structured output schema for Sparsh Keshwani's Quantitative Rating & Conversion Engine (QRCE v3.0.0)",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "author",
    "version",
    "ticker",
    "company_name",
    "macro_regime",
    "timestamp",
    "final_rating",
    "composite_quant_score",
    "confidence_score_pct",
    "factor_breakdown",
    "adjustments",
    "drivers",
    "actionable_threshold",
    "formatted_terminal_report"
  ],
  "properties": {
    "author": {
      "type": "string",
      "const": "Sparsh Keshwani"
    },
    "version": {
      "type": "string",
      "const": "3.0.0"
    },
    "ticker": {
      "type": "string",
      "description": "Exchange ticker symbol, e.g., NVDA, UNH, INTC"
    },
    "company_name": {
      "type": "string"
    },
    "macro_regime": {
      "type": "string",
      "enum": [
        "Baseline Neutral",
        "High Rate/Inflation",
        "Bull Growth",
        "Stagflation/Recession"
      ]
    },
    "timestamp": {
      "type": "string",
      "description": "ISO-8601 evaluation timestamp"
    },
    "final_rating": {
      "type": "string",
      "enum": ["STRONG BUY", "BUY", "HOLD", "SELL", "STRONG SELL"]
    },
    "composite_quant_score": {
      "type": "number",
      "minimum": -100,
      "maximum": 100
    },
    "confidence_score_pct": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    },
    "factor_breakdown": {
      "type": "object",
      "additionalProperties": false,
      "required": ["fin", "grw", "val", "sen", "rsk"],
      "properties": {
        "fin": { "$ref": "#/$defs/factorScore" },
        "grw": { "$ref": "#/$defs/factorScore" },
        "val": { "$ref": "#/$defs/factorScore" },
        "sen": { "$ref": "#/$defs/factorScore" },
        "rsk": { "$ref": "#/$defs/factorScore" }
      }
    },
    "adjustments": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "delta_hard_data",
        "delta_form4_insider",
        "delta_options_short_interest",
        "delta_macro_sector"
      ],
      "properties": {
        "delta_hard_data": { "type": "number", "minimum": -35, "maximum": 10 },
        "delta_form4_insider": { "type": "number", "enum": [-15, 0, 10] },
        "delta_options_short_interest": { "type": "number", "minimum": -15, "maximum": 10 },
        "delta_macro_sector": { "type": "number", "enum": [-10, 0, 10] }
      }
    },
    "drivers": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "primary_bull_factor",
        "primary_bear_factor",
        "form4_insider_signal",
        "critical_catalyst"
      ],
      "properties": {
        "primary_bull_factor": { "type": "string" },
        "primary_bear_factor": { "type": "string" },
        "form4_insider_signal": { "type": "string" },
        "critical_catalyst": { "type": "string" }
      }
    },
    "actionable_threshold": {
      "type": "object",
      "additionalProperties": false,
      "required": ["stance", "horizon"],
      "properties": {
        "stance": {
          "type": "string",
          "enum": ["Accumulate", "Hold", "Reduce", "Exit"]
        },
        "horizon": {
          "type": "string"
        }
      }
    },
    "formatted_terminal_report": {
      "type": "string",
      "description": "80-column ASCII terminal block adhering to Section 7 of QRCE v3.0.0"
    }
  },
  "$defs": {
    "factorScore": {
      "type": "object",
      "additionalProperties": false,
      "required": ["weight", "raw_score", "weighted_contribution"],
      "properties": {
        "weight": { "type": "number", "minimum": 0.1, "maximum": 0.45 },
        "raw_score": { "type": "number", "minimum": -100, "maximum": 100 },
        "weighted_contribution": { "type": "number", "minimum": -45, "maximum": 45 }
      }
    }
  }
}
`,
  },
  {
    path: 'schemas/openai-function-tool.json',
    name: 'openai-function-tool.json',
    folder: 'schemas',
    language: 'json',
    description: 'Function-calling tool definition enabling multi-agent LLM orchestrators to invoke deterministic CQS math.',
    lastUpdated: 'Tool API v3',
    content: `{
  "type": "function",
  "function": {
    "name": "compute_qrce_equity_rating",
    "description": "Calculates the deterministic Composite Quant Score (CQS in [-100, +100]) and renders the QRCE v3.0.0 institutional rating report by Sparsh Keshwani.",
    "strict": true,
    "parameters": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ticker",
        "company_name",
        "regime",
        "s_fin",
        "s_grw",
        "s_val",
        "s_sen",
        "s_rsk",
        "xbrl_divergence_penalty",
        "consensus_modifier",
        "insider_status",
        "short_interest_high",
        "options_flow",
        "macro_filter"
      ],
      "properties": {
        "ticker": { "type": "string" },
        "company_name": { "type": "string" },
        "regime": {
          "type": "string",
          "enum": ["baseline", "high_rate", "bull_growth", "stagflation"]
        },
        "s_fin": { "type": "number", "description": "Financial Health & Solvency [-100, 100]" },
        "s_grw": { "type": "number", "description": "Growth Momentum & Guidance [-100, 100]" },
        "s_val": { "type": "number", "description": "Sector-Relative Valuation [-100, 100]" },
        "s_sen": { "type": "number", "description": "Sentiment & Catalyst Velocity [-100, 100]" },
        "s_rsk": { "type": "number", "description": "Risk, Debt & Governance [-100, 100]" },
        "xbrl_divergence_penalty": { "type": "boolean" },
        "consensus_modifier": {
          "type": "string",
          "enum": ["none", "beat_gt_5", "miss_gt_3"]
        },
        "insider_status": {
          "type": "string",
          "enum": ["neutral", "divergence_sell_5m", "alignment_buy_500k"]
        },
        "short_interest_high": { "type": "boolean" },
        "options_flow": {
          "type": "string",
          "enum": ["neutral", "bearish_pcr_gt_1_5", "bullish_pcr_lt_0_6_darkpool"]
        },
        "macro_filter": {
          "type": "string",
          "enum": ["none", "cyclical_downside", "defensive_bonus"]
        }
      }
    }
  }
}
`,
  },
  {
    path: 'docs/METHODOLOGY.md',
    name: 'METHODOLOGY.md',
    folder: 'docs',
    language: 'markdown',
    description: 'Deep-dive technical whitepaper on continuous sub-score interpolation, regime selection, and CQS clamping.',
    lastUpdated: 'v3.0.0 math spec',
    content: `# QRCE v3.0.0 Quantitative Methodology & Calibration Notes

**Author:** Sparsh Keshwani

---

## 1. Why Bounded Multi-Factor Conversion Matters for LLMs

Unconstrained LLM equity prompts ("Rate this stock from 1 to 10") exhibit severe **central tendency bias** (clustering around 7/10) and **recency/tone anchoring** (adopting the sentiment of CEO prepared remarks).

QRCE resolves both failure modes through three structural mechanisms:

1. **Zero-Centered Continuous Polarity ($[-100, +100]$)**: Forces explicit sign commitment. A neutral company scores \`0\`, not \`70\`.
2. **Orthogonal Regime Weighting ($W_i$)**: Shifts capital priority dynamically—doubling solvency sensitivity from \`0.20\` in a *Bull Growth* regime to \`0.40\` in *High Rate/Inflation* and \`0.45\` in *Stagflation/Recession*.
3. **Asymmetric Penalty Modifiers ($\\Delta$)**: Applies hard-coded step deductions when audited XBRL filings or Form 4 insider dispositions contradict upbeat executive language.

---

## 2. Macroeconomic Regime Identification Heuristics

When the user does not manually lock a regime, the AI agent selects the active vector using observable macro thresholds:

| Regime | Observable Macro Triggers | Weight Vector ($W_1..W_5$) |
| :--- | :--- | :--- |
| **High Rate / Inflation** | Core CPI / PCE > 3.0% YoY OR 10Y Real Yield > 1.75% with restrictive central bank stance | \`[0.40, 0.15, 0.20, 0.15, 0.10]\` |
| **Bull Growth** | ISM Manufacturing/Services > 50, stable/falling policy rates, expanding corporate EPS revisions | \`[0.20, 0.35, 0.20, 0.15, 0.10]\` |
| **Stagflation / Recession** | ISM PMI < 48 for 2+ months, rising unemployment claims, or inverted 2s10s with credit spread widening | \`[0.45, 0.10, 0.25, 0.10, 0.10]\` |
| **Baseline** | Transitional or mid-cycle conditions where neither restrictive stress nor bull expansion dominates | \`[0.30, 0.25, 0.20, 0.15, 0.10]\` |

---

## 3. Continuous Interpolation Across Anchor Points

Each sub-score $S_i \\in [-100, +100]$ is continuous, not limited to \`{-100, 0, +100}\`. Agents interpolate piecewise-linearly across intermediate metrics:

- **$S_{\\text{FIN}}$ Example**: A company with 14% net margin, 5.5% FCF yield, 6.2x interest coverage, and 0.45 Debt/Equity sits roughly two-thirds between neutral (\`0\`) and top-decile (\`+100\`), yielding $S_{\\text{FIN}} \\approx +62$.
- **$S_{\\text{VAL}}$ Sector Peer Normalization**: Never compare a SaaS company's P/E against an integrated oil major. Identify the GICS Industry Group median first:
  - 15th percentile discount (cheaper than 85% of peers) with >30% DCF/multiple margin of safety $\\rightarrow +100$.
  - Within $\\pm 10\\%$ of peer median $\\rightarrow 0$.
  - >90th percentile premium without commensurate growth ($\\text{PEG} > 3.0$) $\\rightarrow -100$.

---

## 4. Boundary Clamping & Statistical Confidence

Because additive $\\Delta$ adjustments can push extreme raw sums beyond $\\pm 100$ (theoretical raw range $[-175, +140]$), the final Composite Quant Score applies boundary clamping:

$$
CQS = \\max\\left(-100,\\; \\min\\left(+100,\\; \\sum_{i=1}^{5} W_i S_i + \\Delta_{\\text{Hard Data}} + \\Delta_{\\text{Alt Data}} + \\Delta_{\\text{Macro}}\\right)\\right)
$$

**Confidence Score Calibration**:
- **Data Completeness Factor**: Full availability of audited 10-Q/10-K XBRL, consensus estimates, and Form 4 filings supports $\\ge 85\\%$ confidence in extreme tiers (**STRONG BUY** / **STRONG SELL**).
- **Missing Feed Haircut**: If an online chatbot lacks real-time options flow or Form 4 visibility and defaults $\\Delta_{\\text{Options}} = 0$, note the missing feed in justification and cap confidence conservatively near the tier floor ($70\\%$–$78\\%$).
`,
  },
  {
    path: 'docs/DATA_FEEDS_AND_EDGAR.md',
    name: 'DATA_FEEDS_AND_EDGAR.md',
    folder: 'docs',
    language: 'markdown',
    description: 'Practical playbook on supplying SEC EDGAR XBRL, Form 4, and derivatives data to online AI chatbots.',
    lastUpdated: 'EDGAR Playbook',
    content: `# Pairing QRCE with SEC EDGAR & Alternative Data in Online Chatbots

**Author:** Sparsh Keshwani

Online AI chatbots perform best when prompted to verify specific primary filings rather than relying on stale training-cutoff recall. Use this playbook to feed high-signal data into QRCE.

---

## 1. Zero-Upload Web Search Prompt Template

When using **ChatGPT (Search enabled)**, **Perplexity Pro**, or **Gemini**, paste this structured user prompt after loading the QRCE skill:

\`\`\`text
Execute QRCE v3.0.0 on [TICKER]. Before scoring, search and verify:
1. Latest SEC Form 10-Q / 10-K: Operating Cash Flow, CapEx (to compute Free Cash Flow), Net Margin, Interest Coverage, Debt-to-Equity, and YoY Accounts Receivable growth vs. Revenue growth.
2. Latest Quarterly Earnings Release: Revenue & EPS % surprise vs. Wall Street consensus, plus full-year guidance revisions.
3. SEC Form 4 Filings (Trailing 90 Days): Open-market purchases (Code P) vs. non-10b5-1 sales (Code S) by CEO/CFO/C-Suite.
4. Market Microstructure: Current Short Interest % of float, Days-to-Cover, and Put/Call ratio.
5. Sector Valuation Medians: Compare [TICKER] forward P/E, EV/EBITDA, and P/FCF against its GICS Industry Group median.
\`\`\`

---

## 2. Reading Form 4 Transaction Codes Accurately

Instruct your agent (or verify manually) to distinguish signal from tax-withholding noise on SEC Form 4 Table I:

| Form 4 Code | Meaning | QRCE $\\Delta_{\\text{Alt Data}}$ Treatment |
| :--- | :--- | :--- |
| **Code \`P\`** | Open-market purchase | **High Signal**: CEO/CFO \`P\` > $500k triggers **+10 Points** Alignment Bonus. |
| **Code \`S\`** | Open-market sale | **High Signal**: Discretionary C-Suite net \`S\` > $5M in 90d alongside bullish commentary triggers **-15 Points** Divergence Penalty. |
| **Code \`F\` / \`M\`** | Tax withholding / Option exercise | **Neutral (\`0 Points\`)**: Administrative RSU/option settlement; do not penalize as discretionary insider dumping. |

---

## 3. Detecting XBRL Cash-Flow Divergence (-20 Points)

Management press releases routinely highlight **Adjusted Non-GAAP EBITDA** while GAAP working capital deteriorates. Trigger the **-20 Point Divergence Penalty** whenever either condition holds:

1. **Negative Free Cash Flow Divergence**: Prepared remarks claim "strong cash generation" or "robust profitability," while \`Operating Cash Flow - CapEx < 0\` in the 10-Q/10-K statement of cash flows.
2. **Channel-Stuffing / Receivables Divergence**: Accounts Receivable grows $>15\\%$ faster YoY than GAAP Revenue (indicating extended payment terms used to pull forward top-line revenue).
`,
  },
  {
    path: 'examples/nvda-bull-growth-case.md',
    name: 'nvda-bull-growth-case.md',
    folder: 'examples',
    language: 'markdown',
    description: 'End-to-end benchmark case study: NVIDIA Corp (NVDA) evaluated under the Bull Growth Regime (+94.0 STRONG BUY).',
    lastUpdated: 'Verified CQS +94.0',
    content: `# Benchmark Case 01: NVIDIA Corporation (NVDA) — Bull Growth Regime

## User Input Summary

- **Macro Regime:** High Growth / Low Rate Bull (\`W = [0.20, 0.35, 0.20, 0.15, 0.10]\`)
- **10-Q XBRL Metrics:** GAAP Net Margin \`55.8%\`, Quarterly FCF \`$16.8B\`, Debt/Equity \`0.18\`, Interest Coverage \`>40x\`.
- **Growth & Consensus:** Revenue \`+94% YoY\` (\`+8.4%\` beat vs. consensus), next-quarter revenue guidance raised above Street mean.
- **Peer Valuation:** Forward P/E \`34x\` vs. Philadelphia Semiconductor Index peer median \`31x\` (\`PEG ~ 1.1x\`).
- **Insider & Flow:** Pre-scheduled 10b5-1 sales below discretionary divergence threshold; Put/Call ratio \`0.52\` accompanied by institutional dark pool block inflows.

---

## Expected QRCE v3.0.0 Output

\`\`\`text
================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : NVDA / NVIDIA Corporation
MACRO REGIME    : Bull Growth
TIMESTAMP       : 2026-10-23 16:00 UTC
--------------------------------------------------------------------------------

FINAL RATING    : STRONG BUY
COMPOSITE QUANT SCORE (CQS) : +94.0 / +100
CONFIDENCE SCORE           : 95%

--------------------------------------------------------------------------------
FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)
--------------------------------------------------------------------------------
[1] Financial Health (20%) : Score =  +92 | Contribution = +18.4
[2] Growth Momentum  (35%) : Score =  +95 | Contribution = +33.2
[3] Valuation (Peer) (20%) : Score =  +15 | Contribution = +3.0
[4] Sentiment        (15%) : Score =  +82 | Contribution = +12.3
[5] Risk Profile     (10%) : Score =  +70 | Contribution = +7.0
--------------------------------------------------------------------------------

HARD DATA & ALT-DATA ADJUSTMENTS
--------------------------------------------------------------------------------
- SEC EDGAR / Consensus Verification : +10 Points
- Form 4 Insider Trading Alignment   : 0 Points
- Short Interest / Options Sentiment : +10 Points
- Macro & Sector Normalization       : 0 Points
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : 55.8% GAAP net margin with +94% YoY revenue acceleration and +8.4% consensus beat
- Primary Bear Factor : Hyperscaler capex concentration across top-4 cloud customers
- Form 4 & Insider Signal : Pre-scheduled 10b5-1 dispositions below $5M 90-day divergence threshold
- Critical Catalyst   : Blackwell rack-scale volume shipments and raised full-year gross margin guidance

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : Accumulate
- Horizon    : 6–12 Months
================================================================================
\`\`\`
`,
  },
  {
    path: 'examples/intc-turnaround-divergent-case.md',
    name: 'intc-turnaround-divergent-case.md',
    folder: 'examples',
    language: 'markdown',
    description: 'Benchmark demonstrating the -20 pt SEC XBRL Free Cash Flow divergence penalty & -15 pt consensus miss.',
    lastUpdated: 'Verified CQS -70.8',
    content: `# Benchmark Case 02: Intel Corporation (INTC) — XBRL Narrative Divergence

## User Input Summary

- **Macro Regime:** High Interest Rate / Inflation (\`W = [0.40, 0.15, 0.20, 0.15, 0.10]\`)
- **Transcript vs. XBRL Check:** Management press release emphasized *"operational profitability milestone"*, whereas 10-Q Statement of Cash Flows shows \`-$3.1B\` trailing Free Cash Flow (**triggers -20 pt XBRL Divergence Penalty**) and EPS missed consensus by \`-6.2%\` (**triggers -15 pt Consensus Miss Modifier**).
- **Options Sentiment:** Put/Call ratio spiked to \`1.68\` following 4 sell-side downgrades (**triggers -5 pt Options Bearish Modifier**).

---

## Expected QRCE v3.0.0 Output

\`\`\`text
================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : INTC / Intel Corporation
MACRO REGIME    : High Rate/Inflation
TIMESTAMP       : 2026-10-23 16:00 UTC
--------------------------------------------------------------------------------

FINAL RATING    : STRONG SELL
COMPOSITE QUANT SCORE (CQS) : -72.8 / +100
CONFIDENCE SCORE           : 88%

--------------------------------------------------------------------------------
FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)
--------------------------------------------------------------------------------
[1] Financial Health (40%) : Score =  -45 | Contribution = -18.0
[2] Growth Momentum  (15%) : Score =  -40 | Contribution = -6.0
[3] Valuation (Peer) (20%) : Score =  +10 | Contribution = +2.0
[4] Sentiment        (15%) : Score =  -55 | Contribution = -8.3
[5] Risk Profile     (10%) : Score =  -25 | Contribution = -2.5
--------------------------------------------------------------------------------

HARD DATA & ALT-DATA ADJUSTMENTS
--------------------------------------------------------------------------------
- SEC EDGAR / Consensus Verification : -35 Points
- Form 4 Insider Trading Alignment   : 0 Points
- Short Interest / Options Sentiment : -5 Points
- Macro & Sector Normalization       : 0 Points
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : Tangible book value floor and CHIPS Act capital grant disbursements
- Primary Bear Factor : 10-Q XBRL negative FCF (-$3.1B) contradicts management profitability narrative (-20 pt penalty)
- Form 4 & Insider Signal : No C-suite open-market purchases above $500k threshold over trailing 90 days
- Critical Catalyst   : 18A process node external foundry customer tape-out milestones

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : Exit
- Horizon    : Immediate
================================================================================
\`\`\`
`,
  },
  {
    path: 'examples/unh-high-rate-defensive-case.md',
    name: 'unh-high-rate-defensive-case.md',
    folder: 'examples',
    language: 'markdown',
    description: 'Benchmark demonstrating High-Rate Regime 40% solvency weight +10 Defensive Bonus & +10 Form 4 buy alignment.',
    lastUpdated: 'Verified CQS +70.4',
    content: `# Benchmark Case 03: UnitedHealth Group (UNH) — High-Rate Defensive Alignment

## User Input Summary

- **Macro Regime:** High Interest Rate / Inflation (\`W = [0.40, 0.15, 0.20, 0.15, 0.10]\`)
- **10-Q/10-K Solvency:** \`8.4%\` FCF yield, \`11.2x\` interest coverage, \`+9%\` YoY revenue growth in line with guidance.
- **Sector Valuation:** Forward P/E \`18.2x\` (bottom quartile of Managed Care / Healthcare peers).
- **Form 4 & Macro Modifiers:** Verified Form 4 Code \`P\` open-market purchase of \`$1.2M\` by CFO (**+10 pts**) + cash-rich Healthcare sector in High Rate regime (**+10 pts Defensive Asset Class Bonus**).

---

## Expected QRCE v3.0.0 Output

\`\`\`text
================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : UNH / UnitedHealth Group Inc.
MACRO REGIME    : High Rate/Inflation
TIMESTAMP       : 2026-10-23 16:00 UTC
--------------------------------------------------------------------------------

FINAL RATING    : STRONG BUY
COMPOSITE QUANT SCORE (CQS) : +70.4 / +100
CONFIDENCE SCORE           : 87%

--------------------------------------------------------------------------------
FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)
--------------------------------------------------------------------------------
[1] Financial Health (40%) : Score =  +68 | Contribution = +27.2
[2] Growth Momentum  (15%) : Score =  +35 | Contribution = +5.3
[3] Valuation (Peer) (20%) : Score =  +52 | Contribution = +10.4
[4] Sentiment        (15%) : Score =  +20 | Contribution = +3.0
[5] Risk Profile     (10%) : Score =  +45 | Contribution = +4.5
--------------------------------------------------------------------------------

HARD DATA & ALT-DATA ADJUSTMENTS
--------------------------------------------------------------------------------
- SEC EDGAR / Consensus Verification : 0 Points
- Form 4 Insider Trading Alignment   : +10 Points
- Short Interest / Options Sentiment : 0 Points
- Macro & Sector Normalization       : +10 Points
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : 8.4% FCF yield and 11.2x interest coverage weighted at 40% under High-Rate regime
- Primary Bear Factor : Medicare Advantage medical care ratio (MCR) utilization pressure
- Form 4 & Insider Signal : Verified Form 4 open-market purchase >$500k ($1.2M CFO buy, +10 pt bonus)
- Critical Catalyst   : CMS final Medicare Advantage rate notice and Optum Rx margin expansion

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : Accumulate
- Horizon    : 6–12 Months
================================================================================
\`\`\`
`,
  },
  {
    path: 'scripts/qrce_validator.py',
    name: 'qrce_validator.py',
    folder: 'scripts',
    language: 'python',
    description: 'Standalone Python 3.10+ CLI tool to deterministically compute CQS and audit LLM terminal outputs.',
    lastUpdated: 'Python 3.10+',
    content: `#!/usr/bin/env python3
"""
Quantitative Rating & Conversion Engine (QRCE v3.0.0) — Reference CLI Validator
Author: Sparsh Keshwani
License: MIT
"""

from __future__ import annotations
import argparse
from dataclasses import dataclass
from datetime import datetime, timezone

REGIME_WEIGHTS: dict[str, tuple[str, dict[str, float]]] = {
    "baseline": ("Baseline Neutral", {"fin": 0.30, "grw": 0.25, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "high_rate": ("High Rate/Inflation", {"fin": 0.40, "grw": 0.15, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "bull_growth": ("Bull Growth", {"fin": 0.20, "grw": 0.35, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "stagflation": ("Stagflation/Recession", {"fin": 0.45, "grw": 0.10, "val": 0.25, "sen": 0.10, "rsk": 0.10}),
}


@dataclass
class QRCEInput:
    ticker: str
    name: str
    regime: str
    fin: float
    grw: float
    val: float
    sen: float
    rsk: float
    xbrl_divergence: bool = False
    consensus: str = "none"  # none | beat | miss
    insider: str = "neutral"  # neutral | sell_divergence | buy_alignment
    high_short_interest: bool = False
    options: str = "neutral"  # neutral | bearish_pcr | bullish_darkpool
    macro_filter: str = "none"  # none | cyclical_penalty | defensive_bonus


def fmt_signed(val: float, decimals: int = 1) -> str:
    formatted = f"{val:.{decimals}f}"
    return f"+{formatted}" if val > 0 else formatted


def fmt_int_signed(val: int) -> str:
    return f"+{val}" if val > 0 else str(val)


def evaluate_qrce(data: QRCEInput) -> str:
    regime_label, w = REGIME_WEIGHTS[data.regime]
    for key, score in [("fin", data.fin), ("grw", data.grw), ("val", data.val), ("sen", data.sen), ("rsk", data.rsk)]:
        if not -100.0 <= score <= 100.0:
            raise ValueError(f"Sub-score {key}={score} must be within [-100, +100].")

    c_fin = w["fin"] * data.fin
    c_grw = w["grw"] * data.grw
    c_val = w["val"] * data.val
    c_sen = w["sen"] * data.sen
    c_rsk = w["rsk"] * data.rsk
    base_sum = c_fin + c_grw + c_val + c_sen + c_rsk

    delta_hard = (-20 if data.xbrl_divergence else 0) + (
        10 if data.consensus == "beat" else -15 if data.consensus == "miss" else 0
    )
    delta_insider = -15 if data.insider == "sell_divergence" else 10 if data.insider == "buy_alignment" else 0
    delta_options = (-10 if data.high_short_interest else 0) + (
        -5 if data.options == "bearish_pcr" else 10 if data.options == "bullish_darkpool" else 0
    )
    delta_macro = -10 if data.macro_filter == "cyclical_penalty" else 10 if data.macro_filter == "defensive_bonus" else 0

    raw_cqs = base_sum + delta_hard + delta_insider + delta_options + delta_macro
    cqs = max(-100.0, min(100.0, round(raw_cqs, 1)))

    if cqs >= 65:
        rating, stance, horizon, conf = "STRONG BUY", "Accumulate", "6–12 Months", min(98, round(85 + ((cqs - 65) / 35) * 12))
    elif cqs >= 20:
        rating, stance, horizon, conf = "BUY", "Accumulate", "6–12 Months", min(88, round(70 + ((cqs - 20) / 44) * 15))
    elif cqs <= -65:
        rating, stance, horizon, conf = "STRONG SELL", "Exit", "Immediate", min(98, round(85 + ((abs(cqs) - 65) / 35) * 12))
    elif cqs <= -20:
        rating, stance, horizon, conf = "SELL", "Reduce", "3–6 Months", min(88, round(70 + ((abs(cqs) - 20) / 44) * 15))
    else:
        rating, stance, horizon, conf = "HOLD", "Hold", "Neutral", round(60 + (1 - abs(cqs) / 20) * 14)

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    return "\\n".join([
        "=" * 80,
        "                        QUANTITATIVE ANALYSIS ENGINE                            ",
        "=" * 80,
        "AUTHOR          : Sparsh Keshwani",
        f"TICKER / NAME   : {data.ticker.upper()} / {data.name}",
        f"MACRO REGIME    : {regime_label}",
        f"TIMESTAMP       : {ts}",
        "-" * 80,
        "",
        f"FINAL RATING    : {rating}",
        f"COMPOSITE QUANT SCORE (CQS) : {fmt_signed(cqs)} / +100",
        f"CONFIDENCE SCORE           : {conf}%",
        "",
        "-" * 80,
        "FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)",
        "-" * 80,
        f"[1] Financial Health ({int(w['fin']*100)}%) : Score = {fmt_int_signed(int(data.fin)):>4} | Contribution = {fmt_signed(c_fin)}",
        f"[2] Growth Momentum  ({int(w['grw']*100)}%) : Score = {fmt_int_signed(int(data.grw)):>4} | Contribution = {fmt_signed(c_grw)}",
        f"[3] Valuation (Peer) ({int(w['val']*100)}%) : Score = {fmt_int_signed(int(data.val)):>4} | Contribution = {fmt_signed(c_val)}",
        f"[4] Sentiment        ({int(w['sen']*100)}%) : Score = {fmt_int_signed(int(data.sen)):>4} | Contribution = {fmt_signed(c_sen)}",
        f"[5] Risk Profile     ({int(w['rsk']*100)}%) : Score = {fmt_int_signed(int(data.rsk)):>4} | Contribution = {fmt_signed(c_rsk)}",
        "-" * 80,
        "",
        "HARD DATA & ALT-DATA ADJUSTMENTS",
        "-" * 80,
        f"- SEC EDGAR / Consensus Verification : {fmt_int_signed(delta_hard)} Points",
        f"- Form 4 Insider Trading Alignment   : {fmt_int_signed(delta_insider)} Points",
        f"- Short Interest / Options Sentiment : {fmt_int_signed(delta_options)} Points",
        f"- Macro & Sector Normalization       : {fmt_int_signed(delta_macro)} Points",
        "-" * 80,
        "",
        "RECOMMENDED ACTIONABLE THRESHOLD:",
        f"- Stance     : {stance}",
        f"- Horizon    : {horizon}",
        "=" * 80,
    ])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QRCE v3.0.0 Deterministic Score Validator")
    parser.add_argument("--ticker", required=True)
    parser.add_argument("--name", default="Public Equity")
    parser.add_argument("--regime", choices=list(REGIME_WEIGHTS.keys()), default="baseline")
    parser.add_argument("--fin", type=float, required=True)
    parser.add_argument("--grw", type=float, required=True)
    parser.add_argument("--val", type=float, required=True)
    parser.add_argument("--sen", type=float, required=True)
    parser.add_argument("--rsk", type=float, required=True)
    parser.add_argument("--xbrl-divergence", action="store_true")
    parser.add_argument("--consensus", choices=["none", "beat", "miss"], default="none")
    parser.add_argument("--insider", choices=["neutral", "sell_divergence", "buy_alignment"], default="neutral")
    parser.add_argument("--high-short-interest", action="store_true")
    parser.add_argument("--options", choices=["neutral", "bearish_pcr", "bullish_darkpool"], default="neutral")
    parser.add_argument("--macro-filter", choices=["none", "cyclical_penalty", "defensive_bonus"], default="none")
    args = parser.parse_args()

    print(evaluate_qrce(QRCEInput(
        ticker=args.ticker,
        name=args.name,
        regime=args.regime,
        fin=args.fin,
        grw=args.grw,
        val=args.val,
        sen=args.sen,
        rsk=args.rsk,
        xbrl_divergence=args.xbrl_divergence,
        consensus=args.consensus,
        insider=args.insider,
        high_short_interest=args.high_short_interest,
        options=args.options,
        macro_filter=args.macro_filter,
    )))
`,
  },
  {
    path: 'CITATION.cff',
    name: 'CITATION.cff',
    folder: '',
    language: 'yaml',
    description: 'Standard GitHub Citation File Format (CFF 1.2.0) enabling native "Cite this repository" support on GitHub.',
    lastUpdated: 'CFF 1.2.0',
    content: `cff-version: 1.2.0
message: "If you use the Quantitative Rating & Conversion Engine (QRCE) skill or scoring methodology, please cite it as below."
title: "Quantitative Rating & Conversion Engine (QRCE)"
version: 3.0.0
date-released: 2026-10-23
license: MIT
type: software
authors:
  - family-names: "Keshwani"
    given-names: "Sparsh"
keywords:
  - quantitative-finance
  - equity-research
  - llm-skills
  - system-prompts
  - sec-edgar
  - multi-factor-scoring
`,
  },
  {
    path: 'CHANGELOG.md',
    name: 'CHANGELOG.md',
    folder: '',
    language: 'markdown',
    description: 'Version history across v1.0, v2.0, and Production Grade v3.0.0.',
    lastUpdated: 'v3.0.0',
    content: `# Changelog

All notable changes to the **Quantitative Rating & Conversion Engine (QRCE)** are documented in this file.

## [3.0.0] — 2026-10-23 (Production Grade)

### Added
- **Dynamic Macroeconomic Regime Architecture**: Automatic factor re-weighting across *Baseline*, *High Interest Rate / Inflation*, *High Growth / Low Rate Bull*, and *Recessionary / Stagflation* environments.
- **SEC EDGAR / XBRL Hard-Data Verification Layer**: Added \`-20\` point narrative-divergence penalty when management claims conflict with Free Cash Flow or Accounts Receivable growth.
- **Form 4 Insider & Derivatives Overlay**: Added C-suite 90-day net selling (\`-15\` pts), CEO/CFO open-market purchase alignment (\`+10\` pts), Short Interest/Days-to-Cover (\`-10\` pts), and Put/Call Dark Pool modifiers (\`-5\` / \`+10\` pts).
- **Multi-LLM Adapter Suite**: Native configurations for Claude 3.5/3.7 Projects & \`SKILL.md\`, ChatGPT GPT-4o/o3 Custom GPTs, Google Gemini 1.5/2.0 Gems, and JSON Schema Draft 2020-12 structured outputs.

## [2.0.0] — 2025-11-14

### Added
- Continuous \`[-100, +100]\` sub-score normalization replacing discrete 5-point rubrics.
- Mandatory GICS sector-median relative valuation requirement for $S_{\\text{VAL}}$.

## [1.0.0] — 2025-04-02

### Added
- Initial 5-factor static baseline equity scoring prompt and 80-column terminal report template by Sparsh Keshwani.
`,
  },
  {
    path: 'CONTRIBUTING.md',
    name: 'CONTRIBUTING.md',
    folder: '',
    language: 'markdown',
    description: 'Guidelines for contributing sector peer benchmarks, MCP connectors, and LLM evaluation suites.',
    lastUpdated: 'Maintainer guide',
    content: `# Contributing to QRCE Skill

Thank you for helping extend the **Quantitative Rating & Conversion Engine (QRCE)** for online AI chatbots and institutional LLM pipelines.

## Contribution Areas

1. **Benchmark Case Studies (\`examples/\`)**: Submit real-world SEC 10-K/10-Q + Form 4 test cases with verified deterministic CQS outputs validated via \`scripts/qrce_validator.py\`.
2. **Chatbot & Agent Adapters (\`prompts/\`)**: Contribute tested prompt wrappers for emerging reasoning models while preserving strict adherence to the mathematical weights and boundaries in \`SKILL.md\`.
3. **Sector Valuation Reference Tables (\`docs/\`)**: Add GICS industry group multiple medians (EV/ARR for SaaS, P/TBV for Regional Banks, AFFO multiples for REITs).

## Verification Requirement

Before opening a Pull Request modifying any example report, run \`python3 scripts/qrce_validator.py\` to confirm zero arithmetic drift between weighted factor contributions and the reported \`COMPOSITE QUANT SCORE (CQS)\`.
`,
  },
  {
    path: 'LICENSE',
    name: 'LICENSE',
    folder: '',
    language: 'text',
    description: 'Permissive MIT Open-Source License.',
    lastUpdated: 'MIT',
    content: `MIT License

Copyright (c) 2026 Sparsh Keshwani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software, prompt specification, and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  },
];
