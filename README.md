# Quantitative Rating & Conversion Engine (QRCE)

**Institutional-Grade Multi-Factor Equity Scoring Skill & System Prompt Directive for Online AI Chatbots and LLMs**

Author: **Sparsh Keshwani** · Version: **3.0.0 (Production Grade)** · License: **MIT**
Compatible Runtimes: **Claude 3.5 / 3.7 (Projects & Skills)** · **ChatGPT (GPT-4o / o3 Custom GPTs)** · **Google Gemini 1.5 / 2.0 (Gems)** · **Perplexity Spaces & OpenWebUI**

---

## Overview

Large Language Models routinely fail at institutional equity research due to **narrative bias**: when fed upbeat management earnings call transcripts, standard LLMs echo executive optimism without cross-checking audited cash flow statements, sector peer multiples, or insider Form 4 dispositions.

The **Quantitative Rating & Conversion Engine (QRCE)** by **Sparsh Keshwani** transforms any frontier AI chatbot or agent into a deterministic, regime-aware quantitative analyst. It ingests unstructured qualitative disclosures (10-K/10-Q text, earnings transcripts, analyst notes, regulatory news) alongside hard financial metrics to compute a mathematically bounded **Composite Quant Score** ($CQS \in [-100, +100]$) and an actionable institutional rating.

### Core Capabilities

1. **Dynamic Macroeconomic Regime Weighting**: Automatically adjusts factor weights ($W_1 \dots W_5$) across *Baseline*, *High Interest Rate / Inflation*, *High Growth / Low Rate Bull*, and *Recessionary / Stagflation* regimes before scoring.
2. **Narrative-vs-XBRL Divergence Penalization**: Deducts **-20 points** automatically when management claims "strong profitability" while SEC 10-Q/10-K XBRL filings reveal negative Free Cash Flow or receivables growing faster than revenue.
3. **Form 4 Insider & Derivatives Cross-Checks**: Penalizes bullish executive commentary accompanied by C-suite net selling > $5M (**-15 pts**) and rewards verified CEO/CFO open-market buys > $500k (**+10 pts**), plus Short Interest and Put/Call Dark Pool modifiers.
4. **Sector-Relative Valuation Normalization**: Anchors valuation scoring ($S_{\text{VAL}}$) strictly to GICS peer medians (e.g., Software EV/FCF vs. Software median, Energy EV/EBITDA vs. Energy median) rather than arbitrary market-wide multiples.
5. **Deterministic 80-Column Terminal Schema**: Outputs standardized, machine-auditable reports ready for investment committee memos or downstream Python/TypeScript parsers.

---

## Architecture Pipeline

```
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
```

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

| Factor Dimension | Variable | Baseline | High Rate / Inflation | Bull Growth | Stagflation / Recession |
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
| **Claude 3.5 / 3.7 Sonnet & Opus** | `prompts/claude-project-instructions.md` or `SKILL.md` | Paste into **Claude Project -> Set Project Instructions**, or drop `SKILL.md` into `.claude/skills/qrce/SKILL.md`. |
| **ChatGPT (GPT-4o / o3)** | `prompts/chatgpt-custom-gpt.md` | Open **Explore GPTs -> Create -> Configure**, paste into *Instructions*, and enable **Web Search** + **Code Interpreter**. |
| **Google Gemini 1.5 / 2.0** | `prompts/gemini-gem-directive.md` | Open **Gem Manager -> New Gem**, paste into *Instructions*, and attach 10-K/10-Q PDFs directly in chat. |
| **Perplexity Spaces / DeepSeek / Poe** | `prompts/universal-system-prompt.txt` | Paste into **Space Instructions** (with SEC/Web focus enabled) or System Prompt box. |
| **OpenAI / Gemini Structured APIs** | `schemas/qrce-output.schema.json` | Pass `SKILL.md` as `system` message and bind `qrce-output.schema.json` to `response_format` / `responseSchema`. |

---

## Repository Structure

```text
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
```

---

## Verifying LLM Math with the Python Validator

Online chatbots occasionally make arithmetic rounding errors when summing weighted contributions unless Code Interpreter is active. Run `scripts/qrce_validator.py` locally or inside a notebook to audit any score:

```bash
python3 scripts/qrce_validator.py \
  --ticker NVDA \
  --name "NVIDIA Corporation" \
  --regime bull_growth \
  --fin 92 --grw 95 --val 15 --sen 82 --rsk 70 \
  --consensus beat \
  --options bullish_darkpool
```

---

## Citation

If you use QRCE in institutional research workflows, multi-agent hedge fund benchmarks, or quantitative LLM evaluations, please cite:

```bibtex
@software{keshwani2026qrce,
  author       = {Keshwani, Sparsh},
  title        = {Quantitative Rating & Conversion Engine (QRCE): Multi-Factor Algorithmic Equity Skill for LLMs},
  version      = {3.0.0},
  year         = {2026},
  license      = {MIT}
}
```

---

## Disclaimer

QRCE is an algorithmic analytical framework for structured equity research and LLM reasoning standardization. Outputs generated by QRCE do not constitute personalized investment advice or a solicitation to buy or sell securities. Always verify primary SEC EDGAR filings prior to capital allocation.
