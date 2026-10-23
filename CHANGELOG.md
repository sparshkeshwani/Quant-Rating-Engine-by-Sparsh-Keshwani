# Changelog

All notable changes to the **Quantitative Rating & Conversion Engine (QRCE)** are documented in this file.

## [3.1.0] — 2026-10-23 (Production Grade — Dual Jurisdiction: US & Indian Markets)

### Added
- **Indian Stock Market (NSE & BSE) Support**: Comprehensive regulatory and microstructure analysis under the SEBI framework.
- **SEBI LODR Regulation 33 & Ind AS 7 Audit**: Added `-20` point divergence penalty when concall EBITDA optimism conflicts with negative Free Cash Flow in Statement of Cash Flows or Trade Debtors outgrowing revenue by >15% YoY.
- **Promoter Share Pledging Risk**: Added `-15` point systemic risk deduction when promoter pledged shares exceed 20% of their total holding.
- **SEBI PIT Reg 7(2) & SAST Promoter Tracking**: Added promoter creeping acquisition bonus (`+10` pts for >₹25 Cr) and promoter dumping penalty (`-15` pts for >₹50 Cr).
- **NSE Institutional & Derivatives Layer**: FII + DII delivery volume > 60% (`+10` pts), NSE F&O Ban (>95% MWPL) & Put-Call Ratio spikes (`-10` pts).
- **India Macroeconomic Filters**: RBI Monetary Policy Committee (MPC) repo stance, India CPI inflation, Brent crude oil shock (> $90/bbl on import cyclicals, `-10` pts), and domestic Union Budget capex push (`+10` pts).
- **Indian Market Playbook & Examples**: Added `docs/INDIAN_MARKET_PLAYBOOK.md`, `prompts/indian-market-system-prompt.txt`, `examples/reliance-nse-case.md`, and `examples/hdfcbank-nse-case.md`.

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
