# Benchmark Case 02: Intel Corporation (INTC) — XBRL Narrative Divergence

## User Input Summary

- **Macro Regime:** High Interest Rate / Inflation (`W = [0.40, 0.15, 0.20, 0.15, 0.10]`)
- **Transcript vs. XBRL Check:** Management press release emphasized *"operational profitability milestone"*, whereas 10-Q Statement of Cash Flows shows `-$3.1B` trailing Free Cash Flow (**triggers -20 pt XBRL Divergence Penalty**) and EPS missed consensus by `-6.2%` (**triggers -15 pt Consensus Miss Modifier**).
- **Options Sentiment:** Put/Call ratio spiked to `1.68` following 4 sell-side downgrades (**triggers -5 pt Options Bearish Modifier**).

---

## Expected QRCE v3.0.0 Output

```text
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
```
