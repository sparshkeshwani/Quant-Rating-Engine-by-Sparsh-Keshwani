# Benchmark Case 01: NVIDIA Corporation (NVDA) — Bull Growth Regime

## User Input Summary

- **Macro Regime:** High Growth / Low Rate Bull (`W = [0.20, 0.35, 0.20, 0.15, 0.10]`)
- **10-Q XBRL Metrics:** GAAP Net Margin `55.8%`, Quarterly FCF `$16.8B`, Debt/Equity `0.18`, Interest Coverage `>40x`.
- **Growth & Consensus:** Revenue `+94% YoY` (`+8.4%` beat vs. consensus), next-quarter revenue guidance raised above Street mean.
- **Peer Valuation:** Forward P/E `34x` vs. Philadelphia Semiconductor Index peer median `31x` (`PEG ~ 1.1x`).
- **Insider & Flow:** Pre-scheduled 10b5-1 sales below discretionary divergence threshold; Put/Call ratio `0.52` accompanied by institutional dark pool block inflows.

---

## Expected QRCE v3.0.0 Output

```text
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
```
