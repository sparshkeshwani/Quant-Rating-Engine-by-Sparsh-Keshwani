# QRCE v3.0.0 Quantitative Methodology & Calibration Notes

**Author:** Sparsh Keshwani

---

## 1. Why Bounded Multi-Factor Conversion Matters for LLMs

Unconstrained LLM equity prompts ("Rate this stock from 1 to 10") exhibit severe **central tendency bias** (clustering around 7/10) and **recency/tone anchoring** (adopting the sentiment of CEO prepared remarks).

QRCE resolves both failure modes through three structural mechanisms:

1. **Zero-Centered Continuous Polarity ($[-100, +100]$)**: Forces explicit sign commitment. A neutral company scores `0`, not `70`.
2. **Orthogonal Regime Weighting ($W_i$)**: Shifts capital priority dynamically—doubling solvency sensitivity from `0.20` in a *Bull Growth* regime to `0.40` in *High Rate/Inflation* and `0.45` in *Stagflation/Recession*.
3. **Asymmetric Penalty Modifiers ($\Delta$)**: Applies hard-coded step deductions when audited XBRL filings or Form 4 insider dispositions contradict upbeat executive language.

---

## 2. Macroeconomic Regime Identification Heuristics

When the user does not manually lock a regime, the AI agent selects the active vector using observable macro thresholds:

| Regime | Observable Macro Triggers | Weight Vector ($W_1..W_5$) |
| :--- | :--- | :--- |
| **High Rate / Inflation** | Core CPI / PCE > 3.0% YoY OR 10Y Real Yield > 1.75% with restrictive central bank stance | `[0.40, 0.15, 0.20, 0.15, 0.10]` |
| **Bull Growth** | ISM Manufacturing/Services > 50, stable/falling policy rates, expanding corporate EPS revisions | `[0.20, 0.35, 0.20, 0.15, 0.10]` |
| **Stagflation / Recession** | ISM PMI < 48 for 2+ months, rising unemployment claims, or inverted 2s10s with credit spread widening | `[0.45, 0.10, 0.25, 0.10, 0.10]` |
| **Baseline** | Transitional or mid-cycle conditions where neither restrictive stress nor bull expansion dominates | `[0.30, 0.25, 0.20, 0.15, 0.10]` |

---

## 3. Continuous Interpolation Across Anchor Points

Each sub-score $S_i \in [-100, +100]$ is continuous, not limited to `{-100, 0, +100}`. Agents interpolate piecewise-linearly across intermediate metrics:

- **$S_{\text{FIN}}$ Example**: A company with 14% net margin, 5.5% FCF yield, 6.2x interest coverage, and 0.45 Debt/Equity sits roughly two-thirds between neutral (`0`) and top-decile (`+100`), yielding $S_{\text{FIN}} \approx +62$.
- **$S_{\text{VAL}}$ Sector Peer Normalization**: Never compare a SaaS company's P/E against an integrated oil major. Identify the GICS Industry Group median first:
  - 15th percentile discount (cheaper than 85% of peers) with >30% DCF/multiple margin of safety $\rightarrow +100$.
  - Within $\pm 10\%$ of peer median $\rightarrow 0$.
  - >90th percentile premium without commensurate growth ($\text{PEG} > 3.0$) $\rightarrow -100$.

---

## 4. Boundary Clamping & Statistical Confidence

Because additive $\Delta$ adjustments can push extreme raw sums beyond $\pm 100$ (theoretical raw range $[-175, +140]$), the final Composite Quant Score applies boundary clamping:

$$
CQS = \max\left(-100,\; \min\left(+100,\; \sum_{i=1}^{5} W_i S_i + \Delta_{\text{Hard Data}} + \Delta_{\text{Alt Data}} + \Delta_{\text{Macro}}\right)\right)
$$

**Confidence Score Calibration**:
- **Data Completeness Factor**: Full availability of audited 10-Q/10-K XBRL, consensus estimates, and Form 4 filings supports $\ge 85\%$ confidence in extreme tiers (**STRONG BUY** / **STRONG SELL**).
- **Missing Feed Haircut**: If an online chatbot lacks real-time options flow or Form 4 visibility and defaults $\Delta_{\text{Options}} = 0$, note the missing feed in justification and cap confidence conservatively near the tier floor ($70\%$–$78\%$).
