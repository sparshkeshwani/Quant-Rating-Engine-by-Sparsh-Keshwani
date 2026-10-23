#!/usr/bin/env python3
"""
Quantitative Rating & Conversion Engine (QRCE v3.0.0) — Dual-Market Reference CLI Validator
Author: Sparsh Keshwani
License: MIT
Supports: US Equities (SEC EDGAR) & Indian Equities (NSE & BSE / SEBI)
"""

from __future__ import annotations
import argparse
from dataclasses import dataclass
from datetime import datetime, timezone

REGIME_WEIGHTS: dict[str, tuple[str, dict[str, float]]] = {
    "baseline": ("Baseline Neutral", {"fin": 0.30, "grw": 0.25, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "high_rate": ("High Rate/Inflation", {"fin": 0.40, "grw": 0.15, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "bull_growth": ("Bull Growth", {"fin": 0.20, "grw": 0.35, "val": 0.20, "sen": 0.15, "rsk": 0.10}),
    "stagflation": ("Stagflation/Recession", {"fin": 0.45, "grw": 0.10, "val": 0.25, "sen": 0.10, "rsk": 0.10}),
}


@dataclass
class QRCEInput:
    ticker: str
    name: str
    market: str  # "us" or "in"
    regime: str
    fin: float
    grw: float
    val: float
    sen: float
    rsk: float
    xbrl_divergence: bool = False
    consensus: str = "none"  # none | beat | miss
    insider: str = "neutral"  # neutral | sell_divergence | buy_alignment | promoter_buy | promoter_sell
    promoter_pledge_high: bool = False
    high_short_interest: bool = False
    options: str = "neutral"  # neutral | bearish_pcr | bullish_darkpool | fii_dii_delivery | fii_outflow
    macro_filter: str = "none"  # none | cyclical_penalty | defensive_bonus | rbi_hawkish | india_capex


def fmt_signed(val: float, decimals: int = 1) -> str:
    formatted = f"{val:.{decimals}f}"
    return f"+{formatted}" if val > 0 else formatted


def fmt_int_signed(val: int) -> str:
    return f"+{val}" if val > 0 else str(val)


def evaluate_qrce(data: QRCEInput) -> str:
    regime_label, w = REGIME_WEIGHTS[data.regime]
    is_india = data.market.lower() in ("in", "india", "nse", "bse")

    for key, score in [("fin", data.fin), ("grw", data.grw), ("val", data.val), ("sen", data.sen), ("rsk", data.rsk)]:
        if not -100.0 <= score <= 100.0:
            raise ValueError(f"Sub-score {key}={score} must be within [-100, +100].")

    c_fin = w["fin"] * data.fin
    c_grw = w["grw"] * data.grw
    c_val = w["val"] * data.val
    c_sen = w["sen"] * data.sen
    c_rsk = w["rsk"] * data.rsk
    base_sum = c_fin + c_grw + c_val + c_sen + c_rsk

    delta_hard = (-20 if data.xbrl_divergence else 0) + (
        10 if data.consensus == "beat" else -15 if data.consensus == "miss" else 0
    )

    delta_insider = 0
    if data.insider in ("sell_divergence", "promoter_sell"):
        delta_insider = -15
    elif data.insider in ("buy_alignment", "promoter_buy"):
        delta_insider = 10

    delta_pledge = -15 if (is_india and data.promoter_pledge_high) else 0

    delta_options = 0
    if data.high_short_interest:
        delta_options -= 10
    if data.options in ("bearish_pcr", "fii_outflow"):
        delta_options -= 5
    elif data.options in ("bullish_darkpool", "fii_dii_delivery"):
        delta_options += 10

    delta_macro = 0
    if data.macro_filter in ("cyclical_penalty", "rbi_hawkish"):
        delta_macro -= 10
    elif data.macro_filter in ("defensive_bonus", "india_capex"):
        delta_macro += 10

    raw_cqs = base_sum + delta_hard + delta_insider + delta_pledge + delta_options + delta_macro
    cqs = max(-100.0, min(100.0, round(raw_cqs, 1)))

    if cqs >= 65:
        rating, stance, horizon, conf = "STRONG BUY", "Accumulate", "6–12 Months", min(98, round(85 + ((cqs - 65) / 35) * 12))
    elif cqs >= 20:
        rating, stance, horizon, conf = "BUY", "Accumulate", "6–12 Months", min(88, round(70 + ((cqs - 20) / 44) * 15))
    elif cqs <= -65:
        rating, stance, horizon, conf = "STRONG SELL", "Exit", "Immediate", min(98, round(85 + ((abs(cqs) - 65) / 35) * 12))
    elif cqs <= -20:
        rating, stance, horizon, conf = "SELL", "Reduce", "3–6 Months", min(88, round(70 + ((abs(cqs) - 20) / 44) * 15))
    else:
        rating, stance, horizon, conf = "HOLD", "Hold", "Neutral", round(60 + (1 - abs(cqs) / 20) * 14)

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    market_header = "JURISDICTION   : INDIA (NSE & BSE / SEBI LODR REG 33 & PIT REG 7)" if is_india else "JURISDICTION   : US & GLOBAL (SEC EDGAR / NYSE / NASDAQ / FORM 4)"
    hard_data_title = "- BSE/NSE LODR Reg 33 & Ind AS 7 Check " if is_india else "- SEC EDGAR / Consensus Verification   "
    insider_title = "- SEBI PIT Reg 7(2) Promoter Action    " if is_india else "- Form 4 Insider Trading Alignment     "
    options_title = "- NSE F&O, MWPL & FII/DII Delivery     " if is_india else "- Short Interest / Options Sentiment   "
    macro_title = "- RBI MPC & India Macro Normalization  " if is_india else "- Macro & Sector Normalization         "

    adj_lines = [
        f"{hard_data_title}: {fmt_int_signed(delta_hard)} Points",
        f"{insider_title}: {fmt_int_signed(delta_insider)} Points",
    ]
    if is_india:
        adj_lines.append(f"- Promoter Share Pledge Risk (>20%)     : {fmt_int_signed(delta_pledge)} Points")
    adj_lines.extend([
        f"{options_title}: {fmt_int_signed(delta_options)} Points",
        f"{macro_title}: {fmt_int_signed(delta_macro)} Points",
    ])

    return "\n".join([
        "=" * 80,
        "                        QUANTITATIVE ANALYSIS ENGINE                            ",
        "=" * 80,
        "AUTHOR          : Sparsh Keshwani",
        f"TICKER / NAME   : {data.ticker.upper()} / {data.name}",
        market_header,
        f"MACRO REGIME    : {regime_label}",
        f"TIMESTAMP       : {ts}",
        "-" * 80,
        "",
        f"FINAL RATING    : {rating}",
        f"COMPOSITE QUANT SCORE (CQS) : {fmt_signed(cqs)} / +100",
        f"CONFIDENCE SCORE           : {conf}%",
        "",
        "-" * 80,
        "FACTOR MATRIX SCORE BREAKDOWN (DYNAMIC WEIGHTS)",
        "-" * 80,
        f"[1] Financial Health ({int(w['fin']*100)}%) : Score = {fmt_int_signed(int(data.fin)):>4} | Contribution = {fmt_signed(c_fin)}",
        f"[2] Growth Momentum  ({int(w['grw']*100)}%) : Score = {fmt_int_signed(int(data.grw)):>4} | Contribution = {fmt_signed(c_grw)}",
        f"[3] Valuation (Peer) ({int(w['val']*100)}%) : Score = {fmt_int_signed(int(data.val)):>4} | Contribution = {fmt_signed(c_val)}",
        f"[4] Sentiment        ({int(w['sen']*100)}%) : Score = {fmt_int_signed(int(data.sen)):>4} | Contribution = {fmt_signed(c_sen)}",
        f"[5] Risk Profile     ({int(w['rsk']*100)}%) : Score = {fmt_int_signed(int(data.rsk)):>4} | Contribution = {fmt_signed(c_rsk)}",
        "-" * 80,
        "",
        "HARD DATA & ALT-DATA ADJUSTMENTS",
        "-" * 80,
        *adj_lines,
        "-" * 80,
        "",
        "RECOMMENDED ACTIONABLE THRESHOLD:",
        f"- Stance     : {stance}",
        f"- Horizon    : {horizon}",
        "=" * 80,
    ])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QRCE v3.0.0 Dual-Market Score Validator")
    parser.add_argument("--ticker", required=True)
    parser.add_argument("--name", default="Public Equity")
    parser.add_argument("--market", choices=["us", "in"], default="us", help="Market jurisdiction: 'us' (SEC) or 'in' (NSE/BSE)")
    parser.add_argument("--regime", choices=list(REGIME_WEIGHTS.keys()), default="baseline")
    parser.add_argument("--fin", type=float, required=True)
    parser.add_argument("--grw", type=float, required=True)
    parser.add_argument("--val", type=float, required=True)
    parser.add_argument("--sen", type=float, required=True)
    parser.add_argument("--rsk", type=float, required=True)
    parser.add_argument("--xbrl-divergence", action="store_true", help="10-Q/10-K or LODR Reg 33 FCF/Receivables divergence (-20)")
    parser.add_argument("--consensus", choices=["none", "beat", "miss"], default="none")
    parser.add_argument("--insider", choices=["neutral", "sell_divergence", "buy_alignment", "promoter_buy", "promoter_sell"], default="neutral")
    parser.add_argument("--promoter-pledge", action="store_true", help="High promoter pledge > 20% (-15, India only)")
    parser.add_argument("--high-short-interest", action="store_true", help="High short interest or NSE F&O ban (-10)")
    parser.add_argument("--options", choices=["neutral", "bearish_pcr", "bullish_darkpool", "fii_dii_delivery", "fii_outflow"], default="neutral")
    parser.add_argument("--macro-filter", choices=["none", "cyclical_penalty", "defensive_bonus", "rbi_hawkish", "india_capex"], default="none")
    args = parser.parse_args()

    print(evaluate_qrce(QRCEInput(
        ticker=args.ticker,
        name=args.name,
        market=args.market,
        regime=args.regime,
        fin=args.fin,
        grw=args.grw,
        val=args.val,
        sen=args.sen,
        rsk=args.rsk,
        xbrl_divergence=args.xbrl_divergence,
        consensus=args.consensus,
        insider=args.insider,
        promoter_pledge_high=args.promoter_pledge,
        high_short_interest=args.high_short_interest,
        options=args.options,
        macro_filter=args.macro_filter,
    )))
