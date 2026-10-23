# Changelog

All notable changes to the **Quantitative Rating & Conversion Engine (QRCE)** are documented in this file.

## [3.0.0] — 2026-10-23 (Production Grade)

### Added
- **Dynamic Macroeconomic Regime Architecture**: Automatic factor re-weighting across *Baseline*, *High Interest Rate / Inflation*, *High Growth / Low Rate Bull*, and *Recessionary / Stagflation* environments.
- **SEC EDGAR / XBRL Hard-Data Verification Layer**: Added `-20` point narrative-divergence penalty when management claims conflict with Free Cash Flow or Accounts Receivable growth.
- **Form 4 Insider & Derivatives Overlay**: Added C-suite 90-day net selling (`-15` pts), CEO/CFO open-market purchase alignment (`+10` pts), Short Interest/Days-to-Cover (`-10` pts), and Put/Call Dark Pool modifiers (`-5` / `+10` pts).
- **Multi-LLM Adapter Suite**: Native configurations for Claude 3.5/3.7 Projects & `SKILL.md`, ChatGPT GPT-4o/o3 Custom GPTs, Google Gemini 1.5/2.0 Gems, and JSON Schema Draft 2020-12 structured outputs.

## [2.0.0] — 2025-11-14

### Added
- Continuous `[-100, +100]` sub-score normalization replacing discrete 5-point rubrics.
- Mandatory GICS sector-median relative valuation requirement for $S_{\text{VAL}}$.

## [1.0.0] — 2025-04-02

### Added
- Initial 5-factor static baseline equity scoring prompt and 80-column terminal report template by Sparsh Keshwani.
