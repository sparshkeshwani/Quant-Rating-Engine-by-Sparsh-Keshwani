# Contributing to QRCE Skill

Thank you for helping extend the **Quantitative Rating & Conversion Engine (QRCE)** for online AI chatbots and institutional LLM pipelines.

## Contribution Areas

1. **Benchmark Case Studies (`examples/`)**: Submit real-world SEC 10-K/10-Q + Form 4 test cases with verified deterministic CQS outputs validated via `scripts/qrce_validator.py`.
2. **Chatbot & Agent Adapters (`prompts/`)**: Contribute tested prompt wrappers for emerging reasoning models while preserving strict adherence to the mathematical weights and boundaries in `SKILL.md`.
3. **Sector Valuation Reference Tables (`docs/`)**: Add GICS industry group multiple medians (EV/ARR for SaaS, P/TBV for Regional Banks, AFFO multiples for REITs).

## Verification Requirement

Before opening a Pull Request modifying any example report, run `python3 scripts/qrce_validator.py` to confirm zero arithmetic drift between weighted factor contributions and the reported `COMPOSITE QUANT SCORE (CQS)`.
