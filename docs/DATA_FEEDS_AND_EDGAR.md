# Pairing QRCE with SEC EDGAR & Alternative Data in Online Chatbots

**Author:** Sparsh Keshwani

Online AI chatbots perform best when prompted to verify specific primary filings rather than relying on stale training-cutoff recall. Use this playbook to feed high-signal data into QRCE.

---

## 1. Zero-Upload Web Search Prompt Template

When using **ChatGPT (Search enabled)**, **Perplexity Pro**, or **Gemini**, paste this structured user prompt after loading the QRCE skill:

```text
Execute QRCE v3.0.0 on [TICKER]. Before scoring, search and verify:
1. Latest SEC Form 10-Q / 10-K: Operating Cash Flow, CapEx (to compute Free Cash Flow), Net Margin, Interest Coverage, Debt-to-Equity, and YoY Accounts Receivable growth vs. Revenue growth.
2. Latest Quarterly Earnings Release: Revenue & EPS % surprise vs. Wall Street consensus, plus full-year guidance revisions.
3. SEC Form 4 Filings (Trailing 90 Days): Open-market purchases (Code P) vs. non-10b5-1 sales (Code S) by CEO/CFO/C-Suite.
4. Market Microstructure: Current Short Interest % of float, Days-to-Cover, and Put/Call ratio.
5. Sector Valuation Medians: Compare [TICKER] forward P/E, EV/EBITDA, and P/FCF against its GICS Industry Group median.
```

---

## 2. Reading Form 4 Transaction Codes Accurately

Instruct your agent (or verify manually) to distinguish signal from tax-withholding noise on SEC Form 4 Table I:

| Form 4 Code | Meaning | QRCE $\Delta_{\text{Alt Data}}$ Treatment |
| :--- | :--- | :--- |
| **Code `P`** | Open-market purchase | **High Signal**: CEO/CFO `P` > $500k triggers **+10 Points** Alignment Bonus. |
| **Code `S`** | Open-market sale | **High Signal**: Discretionary C-Suite net `S` > $5M in 90d alongside bullish commentary triggers **-15 Points** Divergence Penalty. |
| **Code `F` / `M`** | Tax withholding / Option exercise | **Neutral (`0 Points`)**: Administrative RSU/option settlement; do not penalize as discretionary insider dumping. |

---

## 3. Detecting XBRL Cash-Flow Divergence (-20 Points)

Management press releases routinely highlight **Adjusted Non-GAAP EBITDA** while GAAP working capital deteriorates. Trigger the **-20 Point Divergence Penalty** whenever either condition holds:

1. **Negative Free Cash Flow Divergence**: Prepared remarks claim "strong cash generation" or "robust profitability," while `Operating Cash Flow - CapEx < 0` in the 10-Q/10-K statement of cash flows.
2. **Channel-Stuffing / Receivables Divergence**: Accounts Receivable grows $>15\%$ faster YoY than GAAP Revenue (indicating extended payment terms used to pull forward top-line revenue).
