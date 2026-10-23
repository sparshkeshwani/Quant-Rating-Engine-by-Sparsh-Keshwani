# QRCE Indian Stock Market Playbook (NSE & BSE / SEBI Framework)

**Author:** Sparsh Keshwani
**Target Market:** National Stock Exchange (NSE) & Bombay Stock Exchange (BSE), India
**Regulatory Anchor:** Securities and Exchange Board of India (SEBI) LODR, PIT, SAST Regulations & Ind AS 7

---

## 1. Executive Overview

Analyzing equities listed on the **National Stock Exchange (NSE)** and **Bombay Stock Exchange (BSE)** requires fundamentally different regulatory and behavioral adjustments than US markets. 

While US equity analysis centers around SEC EDGAR 10-K/10-Q XBRL and Form 4 filings, the **Indian Equity Ecosystem** revolves around:
1. **SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 (LODR Reg 33)**: Quarterly financial results, Limited Review Reports by statutory auditors, and Statement of Assets and Liabilities / Cash Flows.
2. **Promoter Shareholding & Pledging Risks**: Promoters typically hold 40%–75% of Indian listed companies. **Promoter Share Pledging** to Non-Banking Financial Companies (NBFCs) and mutual funds creates severe systemic margin call vulnerability during market drawdowns.
3. **SEBI (Prohibition of Insider Trading) Regulations, 2015 (PIT Reg 7(2))**: Continual disclosures of promoter, director, and designated person transactions, alongside SAST (Substantial Acquisition of Shares and Takeovers) Reg 29 disclosures.
4. **Institutional Counter-Flow Dynamics**: Institutional trading is characterized by the tug-of-war between **Foreign Institutional Investors (FIIs / FPIs)** and relentless **Domestic Institutional Investors (DIIs)** driven by monthly systematic investment plans (SIPs > ₹20,000 Cr/month).
5. **Macroeconomic Sensitivity**: Reserve Bank of India (RBI) Monetary Policy Committee (MPC) repo rate stance, headline/food Consumer Price Index (CPI), and India's heavy dependence on imported crude oil (Brent > $90/bbl impact on Indian Current Account Deficit and the Rupee INR).

---

## 2. Hard Data Verification: SEBI LODR Regulation 33 & Ind AS 7

### A. The Earnings Concall vs. Cash Flow Divergence Penalty (-20 Points)

Management commentary in post-earnings investor conference calls and television interviews frequently emphasizes **Adjusted EBITDA**, **Orderbook Wins**, and **Non-GAAP Operating Metrics**. 

QRCE triggers the **-20 Point Divergence Penalty** if:
1. **Negative Free Cash Flow (Ind AS 7 Statement of Cash Flows)**: Management claims "strong operational turnaround" or "robust profitability", while **Cash Flow from Operating Activities (CFO) minus Capital Expenditures (Capex)** is negative over the trailing four quarters.
2. **Trade Receivables (Debtors) Channel Stuffing**: Trade Debtors outpace revenue growth by **> 15% YoY** without an extended credit justification (e.g., revenue grew +8% but debtors jumped +32%), indicating uncollected aggressive sales recognized to meet street estimates.
3. **Auditor Qualifications / Notes to Accounts**: The Limited Review Report by statutory auditors contains a qualified opinion, emphasis of matter regarding going concern, or material uncertainty over recoverability of advances.

### B. Consensus Discrepancy Modifier (Bloomberg / Trendlyne / Moneycontrol)
* **Consensus Beat > 5% on Quarterly PAT / Revenue**: **+10 Points**
* **Consensus Miss > 3% on Quarterly PAT / Revenue**: **-15 Points**

---

## 3. Alternative Data & Promoter Governance Layer ($\Delta_{\text{Alt Data}}$)

### A. SEBI PIT Reg 7(2) & SAST Promoter Trading
* **Promoter Alignment Bonus (+10 Points)**: Promoters or key directors make open-market purchases (creeping acquisition under SAST Reg 3) exceeding **₹25 Crore** over the trailing 90 days.
* **Promoter Divergence Penalty (-15 Points)**: Management strikes a bullish public tone on earnings calls, but promoters dump equity stakes via open market blocks or unfavorable bulk deals exceeding **₹50 Crore** in the trailing 90 days.

### B. The Indian Promoter Pledge Penalty (-15 Points)
In the Indian market, when promoters pledge their personal shareholding to borrow debt for subsidiary ventures or real estate, a sharp market decline triggers lender margin calls. If the promoter fails to deposit cash collateral, lenders dump pledged shares into the secondary market, triggering a liquidation cascade.

* **High Promoter Pledge Flag (-15 Points)**: **Pledged Shares > 20% of total promoter holding**, or fresh pledges created during a period of stock price weakness.

### C. Institutional Delivery & NSE F&O Derivatives
* **High Institutional Delivery Accumulation (+10 Points)**: Combined FII + DII net accumulation on NSE with **Delivery Volume > 60%** of total traded volume.
* **F&O Ban / Extreme Speculative Buildup (-10 Points)**: Stock enters the **NSE F&O Ban Period** (Open Interest crosses 95% of Market-Wide Position Limit / MWPL) or Put-Call Ratio (PCR) spikes above **1.4** with short buildup.
* **Bullish PCR & Block Accumulation (+10 Points)**: Stock Options PCR < 0.70 accompanied by heavy DII mutual fund block deal absorption.

---

## 4. India Macro & RBI Monetary Policy Normalization ($\Delta_{\text{Macro}}$)

* **Hawkish RBI & Crude Shock Penalty (-10 Points)**:
  * Persistent India CPI > 5.5% accompanied by RBI MPC "Withdrawal of Accommodation" stance.
  * Brent Crude Oil > $90/barrel acting as an input cost shock for import-heavy cyclical sectors (Paints, Oil Marketing Companies, Specialty Chemicals, Aviation, Auto OEMs).
  * Rapid INR currency depreciation (> ₹85/USD) pressuring foreign debt service.
* **India Capex Boom & Defensive Bonus (+10 Points)**:
  * High domestic capex cycle driven by Union Budget allocation (Railways, Defense, Power Grid, Infrastructure).
  * High-rate RBI regime applied to cash-rich, low-debt Indian defensive sectors (Pharma, Private Banks with low Gross NPA and high Provision Coverage Ratio, and Consumer Staples).

---

## 5. Summary Table: QRCE Indian Market Adjustment Matrix

| Factor / Modifier | Condition | Point Adjustment |
| :--- | :--- | :--- |
| **LODR Reg 33 / Ind AS 7 Divergence** | Management profit spin vs. Negative FCF (Ind AS 7) or Debtors growth >15% above revenue | **-20 Points** |
| **Quarterly Consensus Surprise** | PAT / Revenue Beat > 5% vs. Analyst Mean | **+10 Points** |
| | PAT / Revenue Miss > 3% vs. Analyst Mean | **-15 Points** |
| **SEBI PIT Promoter Creeping Buy** | Promoter open-market acquisition > ₹25 Crore in 90 days | **+10 Points** |
| **Promoter Stake Dump** | Promoter open-market / block selling > ₹50 Crore in 90 days | **-15 Points** |
| **Promoter Pledge Red Flag** | Pledged Shares > 20% of Promoter Holding | **-15 Points** |
| **FII / DII Institutional Delivery** | FII + DII Net Buying with NSE Delivery % > 60% | **+10 Points** |
| **NSE F&O Derivatives Risk** | Stock in F&O Ban (>95% MWPL) OR F&O PCR > 1.40 Bearish Spike | **-10 Points** |
| **India Macro Headwind** | Brent Crude > $90/bbl, Hawkish RBI MPC, or Rupee Depreciation on Cyclicals | **-10 Points** |
| **India Capex / Defensive Tailwinds** | Government Capex Push OR High-Rate Banking / FMCG Resilience | **+10 Points** |
