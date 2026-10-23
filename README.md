# Quantitative Rating & Conversion Engine (QRCE)

**Dual-Jurisdiction Institutional Multi-Factor Equity Scoring Skill & System Prompt Directive for Online AI Chatbots and LLMs**

Author: **Sparsh Keshwani** · Version: **3.1.0 (Production Grade — Dual Jurisdiction)** · License: **MIT**  
Supported Markets: **Indian Stock Market (NSE & BSE / SEBI)** · **US & Global Equities (SEC EDGAR / NYSE / NASDAQ)**  
Compatible Runtimes: **Claude 3.5 / 3.7 (Projects & Skills)** · **ChatGPT (GPT-4o / o3 Custom GPTs)** · **Google Gemini 1.5 / 2.0 (Gems)** · **Perplexity Spaces & OpenWebUI**

---

## Overview

Large Language Models routinely fail at institutional equity research due to **narrative bias**: when fed upbeat management earnings call transcripts or investor presentations, standard LLMs echo executive optimism without cross-checking audited cash flow statements, sector peer multiples, insider Form 4 dispositions, or promoter share pledges.

The **Quantitative Rating & Conversion Engine (QRCE)** by **Sparsh Keshwani** transforms any frontier AI chatbot or autonomous agent into a deterministic, regime-aware quantitative analyst. It ingests unstructured qualitative disclosures (concalls, 10-K/10-Q text, BSE/NSE corporate announcements, analyst notes) alongside hard financial metrics to compute a mathematically bounded **Composite Quant Score** ($CQS \in [-100, +100]$) and an actionable institutional rating.

### Dual-Jurisdiction Architecture

QRCE v3.1 natively supports two major financial jurisdictions with distinct regulatory and alternative-data layers:

1. **Indian Stock Market (NSE & BSE)**:
   - **SEBI LODR Regulation 33 & Ind AS 7**: Audited quarterly financial results, limited review reports, and Free Cash Flow cross-examination. Deducts **-20 pts** when reported EBITDA growth conflicts with negative Ind AS 7 operating cash flows or when Trade Receivables (Debtors) outgrow revenue by >15% YoY.
   - **Promoter Share Pledging Risk**: Deducts **-15 pts** when promoter pledged shares exceed 20% of their total holding (a major systemic margin-call vulnerability in Indian midcaps/smallcaps).
   - **SEBI PIT Reg 7(2) & SAST Disclosures**: Rewards promoter creeping acquisitions > ₹25 Cr (**+10 pts**) and penalizes promoter dumping/block sales > ₹50 Cr (**-15 pts**).
   - **Institutional Delivery & NSE F&O**: Identifies combined FII + DII delivery accumulation (>60% delivery volume, **+10 pts**), NSE stock options Put-Call Ratio (PCR > 1.4, **-5 pts**), and stocks entering the **F&O Ban Period** (>95% MWPL, **-10 pts**).
   - **India Macro & RBI Policy**: Adjusts dynamically for RBI Repo rate stance, headline/food CPI inflation, Brent crude oil shocks (> $90/bbl, **-10 pts** for import cyclicals), and Indian Capex tailwinds (**+10 pts**).

2. **US & Global Equities (SEC EDGAR)**:
   - **SEC 10-K / 10-Q XBRL Audits**: Free Cash Flow divergence penalty (**-20 pts**) and Wall Street consensus surprises (**+10 / -15 pts**).
   - **SEC Form 4 C-Suite Insider Disclosures**: Net selling > $5M (**-15 pts**) vs. CEO/CFO open-market purchases > $500k (**+10 pts**).
   - **Market Microstructure**: Short interest > 15% of float with Days-to-Cover > 6 (**-10 pts**), and Put/Call dark pool block flow (**-5 / +10 pts**).

---

## Architecture Pipeline

\`\`\`
+-----------------------------------------------------------------------------+
|                         UNSTRUCTURED & HARD INPUTS                          |
|  India: BSE/NSE LODR Reg 33 | Ind AS 7 Cash Flows | SEBI PIT Promoter Trades|
|  US:    SEC 10-K / 10-Q     | XBRL Cash Flows     | Form 4 C-Suite Filings  |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|  STEP 1: MACRO REGIME CLASSIFIER                                            |
|  India: [Baseline | High Rate Hawkish RBI | Capex Expansion Bull | Contagion]|
|  US:    [Baseline | High Rate Inflation   | Bull Growth          | Recess. ]|
|  Selects W1..W5 Vector dynamically (Weights sum to 1.00)                    |
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
|  + Delta_HardData (Ind AS 7 / XBRL Cash Flow Divergence, Consensus Beat/Miss)|
|  + Delta_AltData  (Promoter Buying / Dumping / Pledge Risk / Form 4 Trades) |
|  + Delta_Options  (FII/DII Delivery > 60%, NSE F&O Ban, Put-Call Ratio)      |
|  + Delta_Macro    (RBI Policy / Crude Shock > $90 / Capex Push)             |
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
CQS = \operatorname{clamp}_{[-100, +100]}\left( \sum_{i=1}^{5} (W_i \times S_i) + \Delta_{\text{Hard Data}} + \Delta_{\text{Alt Data}} + \Delta_{\text{Macro}} \right)
$$

### Actionable Rating Thresholds

| Rating | Score Range ($CQS$) | Statistical Confidence | Target Horizon | Operational Action |
| :--- | :--- | :--- | :--- | :--- |
| **STRONG BUY** | $+65 \text{ to } +100$ | $\ge 85\%$ | 6–12 Months | High-conviction capital allocation / Aggressive accumulation |
| **BUY** | $+20 \text{ to } +64$ | $\ge 70\%$ | 6–12 Months | Standard long entry / Phased accumulation |
| **HOLD** | $-19 \text{ to } +19$ | N/A | Neutral | Maintain current exposure / Portfolio rebalance |
| **SELL** | $-64 \text{ to } -20$ | $\ge 70\%$ | 3–6 Months | De-risk / Systematic reduction of long exposure |
| **STRONG SELL** | $-100 \text{ to } -65$ | $\ge 85\%$ | Immediate | Liquidation of exposure / Tactical short bias |

### Dynamic Regime Weight Matrix

| Factor Dimension | Variable | Baseline | High Rate / Inflation (RBI / Fed) | Bull Growth / India Capex | Stagflation / Contagion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Financial Health & Solvency** | $W_1 / S_{\text{FIN}}$ | 30% (0.30) | **40%** (0.40) | 20% (0.20) | **45%** (0.45) |
| **Growth Momentum & Guidance** | $W_2 / S_{\text{GRW}}$ | 25% (0.25) | 15% (0.15) | **35%** (0.35) | 10% (0.10) |
| **Sector-Relative Valuation** | $W_3 / S_{\text{VAL}}$ | 20% (0.20) | 20% (0.20) | 20% (0.20) | **25%** (0.25) |
| **Sentiment & Catalyst Velocity** | $W_4 / S_{\text{SEN}}$ | 15% (0.15) | 15% (0.15) | 15% (0.15) | 10% (0.10) |
| **Risk, Debt & Governance** | $W_5 / S_{\text{RSK}}$ | 10% (0.10) | 10% (0.10) | 10% (0.10) | 10% (0.10) |

---

## Quick Installation for Online AI Chatbots

| Platform | Recommended File | Setup Path |
| :--- | :--- | :--- |
| **Claude 3.5 / 3.7 Sonnet & Opus** | \`prompts/claude-project-instructions.md\` or \`SKILL.md\` | Paste into **Claude Project -> Project Instructions** or drop into \`.claude/skills/qrce/SKILL.md\`. |
| **ChatGPT (GPT-4o / o3)** | \`prompts/chatgpt-custom-gpt.md\` or \`prompts/indian-market-system-prompt.txt\` | Open **Explore GPTs -> Create -> Configure**, paste into *Instructions*, and enable **Web Search** + **Code Interpreter**. |
| **Google Gemini 1.5 / 2.0** | \`prompts/gemini-gem-directive.md\` | Open **Gem Manager -> New Gem**, paste into *Instructions*, and upload Indian Annual Reports or 10-K PDFs directly in chat. |
| **Perplexity Spaces / DeepSeek / Poe** | \`prompts/indian-market-system-prompt.txt\` (India) or \`prompts/universal-system-prompt.txt\` (US) | Paste into **Space Instructions** with Indian financial sites or SEC Web Search enabled. |
| **OpenAI / Gemini Structured APIs** | \`schemas/qrce-output.schema.json\` | Pass \`SKILL.md\` as system message and bind JSON schema to \`response_format\` / \`responseSchema\`. |

---

## Repository Structure

\`\`\`text
qrce-skill/
├── README.md                                  # Repository documentation & dual-market quickstart
├── SKILL.md                                   # Canonical Agent Skill specification (YAML + v3.1.0 rules)
├── CITATION.cff                               # Institutional citation metadata (CFF 1.2.0)
├── CHANGELOG.md                               # Version release notes (v1.0 -> v3.0 -> v3.1 Dual Jurisdiction)
├── CONTRIBUTING.md                            # Contribution & benchmark evaluation protocol
├── LICENSE                                    # MIT Open-Source License
├── prompts/
│   ├── indian-market-system-prompt.txt        # Dedicated prompt for Indian Stock Market (NSE/BSE/SEBI)
│   ├── claude-project-instructions.md         # XML-tagged system directive for Claude 3.5/3.7
│   ├── chatgpt-custom-gpt.md                  # GPT-4o / o3 Custom GPT configuration & starters
│   ├── gemini-gem-directive.md                # Gemini 1.5/2.0 Gem instructions with Search grounding
│   └── universal-system-prompt.txt            # Zero-dependency prompt for all chat frontends
├── schemas/
│   ├── qrce-output.schema.json                # Strict JSON Schema for programmatic CQS pipelines
│   └── openai-function-tool.json              # Function-calling tool schema for multi-agent workflows
├── docs/
│   ├── INDIAN_MARKET_PLAYBOOK.md              # Complete guide to SEBI LODR, Ind AS 7, and Promoter Pledges
│   ├── METHODOLOGY.md                         # Continuous interpolation & edge-case clamping math
│   └── DATA_FEEDS_AND_EDGAR.md                # SEC EDGAR XBRL, Form 4, and options flow guide
├── examples/
│   ├── reliance-nse-case.md                   # Reliance Industries (NSE) benchmark (STRONG BUY, +99.5)
│   ├── hdfcbank-nse-case.md                   # HDFC Bank (NSE) benchmark (STRONG BUY, +77.9)
│   ├── nvda-bull-growth-case.md               # NVIDIA (US) Bull Growth benchmark (STRONG BUY, +94.0)
│   ├── intc-turnaround-divergent-case.md      # Intel (US) XBRL Divergence benchmark (STRONG SELL, -72.8)
│   └── unh-high-rate-defensive-case.md        # UnitedHealth (US) Defensive benchmark (STRONG BUY, +70.4)
└── scripts/
    └── qrce_validator.py                      # Zero-dependency Python CLI dual-market score validator
\`\`\`

---

## Verifying Score Math with the Python Validator

Run \`scripts/qrce_validator.py\` to deterministically verify any US or Indian market equity score:

\`\`\`bash
# Indian Stock Market Example (Reliance Industries on NSE):
python3 scripts/qrce_validator.py \\
  --ticker RELIANCE.NS \\
  --name "Reliance Industries Limited" \\
  --market in \\
  --regime bull_growth \\
  --fin 75 --grw 82 --val 28 --sen 78 --rsk 85 \\
  --consensus beat \\
  --options fii_dii_delivery \\
  --macro-filter india_capex

# US Equity Example (NVIDIA Corp on NASDAQ):
python3 scripts/qrce_validator.py \\
  --ticker NVDA \\
  --name "NVIDIA Corporation" \\
  --market us \\
  --regime bull_growth \\
  --fin 92 --grw 95 --val 15 --sen 82 --rsk 70 \\
  --consensus beat \\
  --options bullish_darkpool
\`\`\`

---

## Citation

If you use QRCE in institutional research workflows, hedge fund benchmarks, or quantitative LLM evaluations, please cite:

\`\`\`bibtex
@software{keshwani2026qrce,
  author       = {Keshwani, Sparsh},
  title        = {Quantitative Rating & Conversion Engine (QRCE): Multi-Factor Algorithmic Equity Skill for LLMs (Dual Jurisdiction: US & India)},
  version      = {3.1.0},
  year         = {2026},
  license      = {MIT}
}
\`\`\`

---

## Disclaimer

QRCE is an algorithmic analytical framework for structured equity research and LLM reasoning standardization. Outputs generated by QRCE do not constitute personalized investment advice or a solicitation to buy or sell securities. Always verify primary BSE/NSE filings and SEC EDGAR disclosures prior to capital allocation.
