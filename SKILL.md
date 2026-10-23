---
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

# QUANTITATIVE RATING & CONVERSION ENGINE (QRCE)

**Author:** Sparsh Keshwani

**Version:** 3.0.0 (Production Grade)

**Compatibility:** Claude 3.5/3.7, ChatGPT (GPT-4o / O3), Google Gemini 1.5/2.0

**Target Environment:** AI Agent System Prompt / Skill Directive

---

## 1. SYSTEM PURPOSE & FRAMEWORK OVERVIEW

The Quantitative Rating & Conversion Engine (QRCE) is an advanced, multi-factor algorithmic workflow designed for institutional-grade equity research. It ingests unstructured text (earnings transcripts, 10-K/10-Q filings, news, and analyst reports) alongside hard financial data feeds to calculate a mathematically bounded Composite Quant Score ($CQS \in [-100, +100]$).

The engine enforces **hard-data verification**, **alternative data cross-checks**, **dynamic macro regime weighting**, and **sector-relative normalization** to convert qualitative inputs into standardized actionable ratings: **STRONG BUY**, **BUY**, **HOLD**, **SELL**, or **STRONG SELL**.

---

## 2. RATING DEFINITIONS & SCORE BOUNDARIES

$$
CQS = \sum_{i=1}^{5} (W_i \times S_i) + \Delta_{\text{Hard Data}} + \Delta_{\text{Alt Data}} + \Delta_{\text{Macro}}
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

| Factor Dimension | Variable | Baseline Weight | High Interest Rate / Inflation Regime | High Growth / Low Rate Bull Regime | Recessionary / Stagflation Regime |
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
* **+100:** Net margins > 20%, FCF yield > 8%, Interest Coverage > 8x, Debt-to-Equity < 0.3.
* **0:** Stable margins, FCF neutral, Interest Coverage 2x–4x.
* **-100:** Burning cash, negative operating cash flow, Debt/EBITDA > 5x, immediate liquidity distress.

### 2. Growth Momentum & Sector-Relative Guidance ($S_{\text{GRW}}$)
* **+100:** Accelerating YoY revenue growth (>25%), forward guidance raised above market consensus, expanding TAM.
* **0:** In-line consensus revenue growth (0–5%), flat full-year guidance.
* **-100:** YoY revenue contraction, lowered full-year guidance, market share loss to competitors.

### 3. Valuation & Relative Pricing ($S_{\text{VAL}}$)
* *Note: Must be evaluated relative to Sector Medians (e.g., Tech P/E vs. Tech Median, Energy EV/EBITDA vs. Energy Median).*
* **+100:** Multiples (P/E, EV/EBITDA, P/FCF) in bottom 15th percentile of sector peers; Margin of Safety > 30%.
* **0:** Trading within $\pm 10\%$ of sector median multiples.
* **-100:** Multiples exceeding 90th percentile of sector peers without growth rate justification (PEG > 3.0).

### 4. Sentiment & Institutional Velocity ($S_{\text{SEN}}$)
* **+100:** Aggressive institutional net buying, 3+ analyst upgrades in 30 days, positive clinical/regulatory news.
* **0:** Neutral news flow, static institutional holding trends.
* **-100:** Institutional net distribution, multiple analyst downgrades, major litigation/regulatory enforcement.

### 5. Risk, Debt & Governance ($S_{\text{RSK}}$)
* **+100:** Clean accounting/audit logs, share buybacks at low valuations, independent board structure.
* **0:** Standard executive compensation and audit disclosures.
* **-100:** Accounting restatements, SEC investigations, executive turn-over > 50% in 12 months, high debt maturity wall within 12 months.

---

## 5. HARD DATA, SEC FILINGS & ALTERNATIVE DATA CORRECTION LAYER

To prevent executive management "spin" or narrative bias from distorting ratings, apply automatic point adjustments ($\Delta$) based on hard data feeds and Form 4 SEC filings:

### A. SEC EDGAR / XBRL Hard-Data Verification ($\Delta_{\text{Hard Data}}$)
* **Divergence Penalty (-20 Points):** If management text claims "strong profitability" but SEC 10-Q/10-K XBRL data shows negative Free Cash Flow or expanding accounts receivable vs. revenue.
* **Consensus Discrepancy Modifier:**
  * Revenue/EPS Beat > 5% vs. Consensus: **+10 Points**
  * Revenue/EPS Miss > 3% vs. Consensus: **-15 Points**

### B. Form 4 Insider Trading & Alternative Data Rules ($\Delta_{\text{Alt Data}}$)
* **Insider Divergence Penalty (-15 Points):** If executive text/management tone is bullish, but Form 4 filings reveal C-Suite net insider selling > $5M over the trailing 90 days.
* **Insider Alignment Bonus (+10 Points):** Form 4 filings reveal open-market purchases by CEO/CFO > $500k.
* **Short Interest & Options Flow Adjustment:**
  * Short Interest > 15% of Float AND Days-to-Cover > 6: **-10 Points**
  * Put/Call Ratio > 1.5 (Bearish Sentiment Spike): **-5 Points**
  * Put/Call Ratio < 0.6 with High Institutional Dark Pool Inflows: **+10 Points**

### C. Macro & Sector-Relative Filter ($\Delta_{\text{Macro}}$)
* **Cyclical Downside Penalty (-10 Points):** Inverted Yield Curve / Contracting PMI (<48) applied to cyclical sectors (Industrials, Consumer Discretionary).
* **Defensive Asset Class Bonus (+10 Points):** High Interest Rate environment applied to cash-rich, low-debt sectors (Healthcare, Consumer Staples).

---

## 6. AGENT EXECUTION WORKFLOW

1. **Macro Regime Identification:** Detect current macroeconomic regime to assign $W_1 \dots W_5$ weights.
2. **Qualitative Extraction:** Extract key operational, financial, and catalyst statements from text inputs.
3. **Hard Data Cross-Check:** Query API/EDGAR data feeds to verify transcript numbers against audited balance sheets and consensus estimates.
4. **Alternative Data Layer Run:** Apply Form 4 insider trading rules, short interest, and options sentiment modifiers.
5. **Score Normalization:** Compute raw factor sub-scores ($S_i$), apply weight matrix, and calculate final $CQS$.
6. **Output Rendering:** Format output in terminal display schema.

---

## 7. REQUIRED OUTPUT DISPLAY TEMPLATE

```
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
```
