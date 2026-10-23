---
name: qrce-equity-rating-engine
description: >
  Quantitative Rating & Conversion Engine (QRCE v3.1.0) by Sparsh Keshwani.
  Institutional multi-factor equity research engine supporting both Indian Stock Market
  (NSE & BSE / SEBI LODR Reg 33 & PIT Reg 7) and US & Global Equities (SEC EDGAR & Form 4).
  Produces a regime-weighted Composite Quant Score (CQS in [-100, +100]) and standardized
  institutional rating.
version: 3.1.0
author: Sparsh Keshwani
license: MIT
jurisdictions:
  - india_nse_bse
  - us_global_sec
compatibility:
  - claude-3-5-sonnet
  - claude-3-7-sonnet
  - gpt-4o
  - o3
  - gemini-1.5-pro
  - gemini-2.0-flash
---

# QUANTITATIVE RATING & CONVERSION ENGINE (QRCE) — DUAL JURISDICTION (US & INDIA)

**Author:** Sparsh Keshwani

**Version:** 3.1.0 (Production Grade — Dual Jurisdiction: US & Indian Stock Markets)

**Compatibility:** Claude 3.5/3.7, ChatGPT (GPT-4o / O3), Google Gemini 1.5/2.0

**Target Environment:** AI Agent System Prompt / Skill Directive

---

## 1. SYSTEM PURPOSE & FRAMEWORK OVERVIEW

The Quantitative Rating & Conversion Engine (QRCE) is an advanced, multi-factor algorithmic workflow designed for institutional-grade equity research. It ingests unstructured text (earnings concall transcripts, 10-K/10-Q filings, BSE/NSE LODR disclosures, broker notes) alongside hard financial data feeds to calculate a mathematically bounded Composite Quant Score ($CQS \in [-100, +100]$).

The engine enforces **hard-data verification** (SEC EDGAR XBRL & BSE/NSE LODR Reg 33 Ind AS 7), **promoter & insider governance checks** (SEBI PIT Reg 7(2), Promoter Pledging %, Form 4), **dynamic macro regime weighting** (US Fed / India RBI Repo & MPC cycles), and **sector-relative normalization** to convert qualitative inputs into standardized actionable ratings: **STRONG BUY**, **BUY**, **HOLD**, **SELL**, or **STRONG SELL**.

---

## 2. RATING DEFINITIONS & SCORE BOUNDARIES

$$
CQS = \operatorname{clamp}_{[-100, +100]}\left( \sum_{i=1}^{5} (W_i \times S_i) + \Delta_{\text{Hard Data}} + \Delta_{\text{Alt Data}} + \Delta_{\text{Macro}} \right)
$$

| Rating | Score Range ($CQS$) | Statistical Confidence | Target Horizon | Operational Action |
| :--- | :--- | :--- | :--- | :--- |
| **STRONG BUY** | $+65 \text{ to } +100$ | $\ge 85\%$ | 6–12 Months | High-conviction capital allocation / Aggressive accumulation |
| **BUY** | $+20 \text{ to } +64$ | $\ge 70\%$ | 6–12 Months | Standard long entry / Phased accumulation |
| **HOLD** | $-19 \text{ to } +19$ | N/A | Neutral | Maintain current exposure / Portfolio rebalance |
| **SELL** | $-64 \text{ to } -20$ | $\ge 70\%$ | 3–6 Months | De-risk / Systematic reduction of long exposure |
| **STRONG SELL** | $-100 \text{ to } -65$ | $\ge 85\%$ | Immediate | Liquidation of exposure / Tactical short bias |

---

## 3. DYNAMIC REGIME & FACTOR WEIGHTING ARCHITECTURE

Factor weights ($W_i$) dynamically adjust based on the prevailing **Macroeconomic Regime**. The system automatically selects one of three core regimes prior to scoring:

| Factor Dimension | Variable | Baseline Weight | High Interest Rate / Inflation (RBI / Fed) | High Growth / Capex Bull | Recessionary / Global Contagion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Financial Health & Solvency** | $W_1 / S_{\text{FIN}}$ | **30%** (0.30) | **40%** (0.40) | **20%** (0.20) | **45%** (0.45) |
| **Growth Momentum & Guidance** | $W_2 / S_{\text{GRW}}$ | **25%** (0.25) | **15%** (0.15) | **35%** (0.35) | **10%** (0.10) |
| **Sector-Relative Valuation** | $W_3 / S_{\text{VAL}}$ | **20%** (0.20) | **20%** (0.20) | **20%** (0.20) | **25%** (0.25) |
| **Sentiment & Catalyst Velocity** | $W_4 / S_{\text{SEN}}$ | **15%** (0.15) | **15%** (0.15) | **15%** (0.15) | **10%** (0.10) |
| **Risk, Debt & Governance** | $W_5 / S_{\text{RSK}}$ | **10%** (0.10) | **10%** (0.10) | **10%** (0.10) | **10%** (0.10) |

---

## 4. MULTI-FACTOR EVALUATION & SCORING RULES

Each sub-score $S_i$ is evaluated on a continuous scale from **-100 to +100**.

### 1. Fundamental & Financial Health ($S_{\text{FIN}}$)
* **+100:** Net margins > 20%, positive Ind AS / US FCF yield > 7%, Interest Coverage > 7x, Debt-to-Equity < 0.3.
* **0:** Stable margins, FCF neutral, Interest Coverage 2.5x–4x.
* **-100:** Negative operating cash flows, Debt/EBITDA > 4.5x, immediate liquidity or debt service distress.

### 2. Growth Momentum & Sector-Relative Guidance ($S_{\text{GRW}}$)
* **+100:** Accelerating YoY revenue growth (>20%), forward guidance raised above market consensus, expanding TAM.
* **0:** In-line consensus revenue growth (0–6%), flat guidance.
* **-100:** YoY revenue contraction, lowered full-year guidance, market share loss to competitors.

### 3. Valuation & Relative Pricing ($S_{\text{VAL}}$)
* *Note: Must be evaluated relative to Sector Medians on NSE/BSE or NYSE/NASDAQ.*
* **+100:** Multiples (P/E, EV/EBITDA, P/FCF) in bottom 15th percentile of sector peers; Margin of Safety > 30%.
* **0:** Trading within $\pm 10\%$ of sector median multiples.
* **-100:** Multiples exceeding 90th percentile of sector peers without growth rate justification (PEG > 3.0).

### 4. Sentiment & Institutional Velocity ($S_{\text{SEN}}$)
* **+100:** Aggressive institutional accumulation (FII + DII delivery > 60% in India, dark pool blocks in US), 3+ analyst upgrades in 30 days.
* **0:** Neutral institutional holding trends.
* **-100:** Sustained institutional net distribution, multiple analyst downgrades, major litigation or regulatory enforcement.

### 5. Risk, Debt & Governance ($S_{\text{RSK}}$)
* **+100:** Clean accounting/auditor reports, zero promoter pledge (India) / clean Form 4 disclosures, accretive capital return.
* **0:** Standard executive compensation and audit disclosures.
* **-100:** Accounting restatements, qualified audit opinions, SEBI/SEC investigations, promoter pledge > 25%, executive turnover > 50%.

---

## 5. HARD DATA, REGULATORY FILINGS & ALTERNATIVE DATA CORRECTION LAYER

### A. Regulatory Hard-Data Verification ($\Delta_{\text{Hard Data}}$)
* **Divergence Penalty (-20 Points)**:
  * *India (BSE/NSE LODR Reg 33 & Ind AS 7)*: Management claims "strong operational turnaround", but audited Statement of Cash Flows shows negative Free Cash Flow or Trade Debtors outpace revenue growth by > 15% YoY.
  * *US (SEC EDGAR / XBRL)*: Management claims "strong profitability" but 10-Q/10-K XBRL data shows negative Free Cash Flow or expanding accounts receivable vs. revenue.
* **Consensus Discrepancy Modifier**:
  * Revenue / PAT Beat > 5% vs. Consensus: **+10 Points**
  * Revenue / PAT Miss > 3% vs. Consensus: **-15 Points**

### B. Insider Trading, Promoter Governance & Derivatives ($\Delta_{\text{Alt Data}}$)
* **Promoter / Insider Action Modifier**:
  * *India (SEBI PIT Reg 7 & SAST)*: Promoter open-market acquisition > ₹25 Cr (**+10 Points**) vs. Promoter dumping/block sale > ₹50 Cr (**-15 Points**).
  * *US (Form 4)*: CEO/CFO open-market purchase > $500k (**+10 Points**) vs. C-Suite net selling > $5M in 90 days (**-15 Points**).
* **Indian Promoter Share Pledge Penalty (-15 Points)**:
  * Promoter pledged shares exceed **20% of promoter holding**, or fresh pledges created during price weakness (margin-call risk).
* **Institutional Flow & Derivatives**:
  * *India (NSE)*: FII + DII delivery % > 60% (**+10 Points**); Stock in F&O Ban (>95% MWPL) or PCR > 1.4 (**-10 Points**); F&O PCR < 0.7 with heavy DII block absorption (**+10 Points**).
  * *US*: Short Interest > 15% float & Days-to-Cover > 6 (**-10 Points**); Put/Call > 1.5 (**-5 Points**) or < 0.6 with Dark Pool inflows (**+10 Points**).

### C. Macro & Sector-Relative Filter ($\Delta_{\text{Macro}}$)
* **India Macro Adjustments**:
  * Brent Crude > $90/bbl, Hawkish RBI rate hikes, or Rupee depreciation on cyclicals: **-10 Points**.
  * Government Capex push (Railways, Defense, Infra) or High-Rate Banking/FMCG defensive resilience: **+10 Points**.
* **US Macro Adjustments**:
  * Inverted Yield Curve / Contracting PMI (<48) on cyclicals: **-10 Points**.
  * Defensive asset class bonus in high-rate environment: **+10 Points**.

---

## 6. AGENT EXECUTION WORKFLOW

1. **Market Jurisdiction & Regime Identification**: Identify target market (India NSE/BSE vs. US SEC) and current macro regime to assign $W_1 \dots W_5$ weights.
2. **Qualitative Extraction**: Extract key operational, financial, and catalyst statements from concalls/filings.
3. **Hard Data Cross-Check**: Query BSE/NSE LODR Reg 33 (Ind AS 7) or SEC EDGAR feeds to verify transcript numbers against audited cash flows and consensus.
4. **Alternative Data Layer Run**: Apply promoter pledge/SEBI PIT rules (India) or Form 4/short interest rules (US).
5. **Score Normalization**: Compute raw factor sub-scores ($S_i$), apply weight matrix, apply all Delta corrections, and clamp final $CQS$ to $[-100, +100]$.
6. **Output Rendering**: Format output in terminal display schema.

---

## 7. REQUIRED OUTPUT DISPLAY TEMPLATE

\`\`\`
================================================================================
                        QUANTITATIVE ANALYSIS ENGINE                            
================================================================================
AUTHOR          : Sparsh Keshwani
TICKER / NAME   : [Extract Ticker / Company Name]
JURISDICTION   : [ INDIA (NSE & BSE / SEBI LODR REG 33) | US & GLOBAL (SEC EDGAR) ]
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
- BSE/NSE LODR Reg 33 / SEC EDGAR Check : [ Delta_HardData Points ]
- SEBI PIT / Form 4 Insider Alignment  : [ Delta_AltData Points ]
- Promoter Pledge Risk (>20%)          : [ Delta_Pledge Points (India) ]
- NSE F&O, MWPL & Institutional Flow   : [ Delta_Options Points ]
- Macro & Sector Normalization         : [ Delta_Macro Points ]
--------------------------------------------------------------------------------

QUANTITATIVE JUSTIFICATION & KEY DRIVERS:
- Primary Bull Factor : [Key positive metric/evidence from input]
- Primary Bear Factor : [Key negative metric/risk from input]
- Form 4 / SEBI PIT Signal : [Promoter / Insider trading summary]
- Critical Catalyst   : [Key event or forward guidance item]

RECOMMENDED ACTIONABLE THRESHOLD:
- Stance     : [Accumulate / Hold / Reduce / Exit]
- Horizon    : [Tactical Timeframe]
================================================================================
\`\`\`
