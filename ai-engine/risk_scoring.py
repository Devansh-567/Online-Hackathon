"""
Risk scoring module — combines anomaly signals into an interpretable score card.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Sequence

from anomaly_detection import detect_anomalies


@dataclass
class RiskBreakdown:
    total: float
    factors: Dict[str, float]
    flags: List[str]


def score_expense(
    amount: float,
    category: str,
    peer_amounts: Sequence[float],
    merchant: str | None = None,
    prior_rejections: int = 0,
) -> RiskBreakdown:
    """Produce a transparent risk breakdown for auditors."""
    anomaly = detect_anomalies(amount, category, peer_amounts, merchant)
    factors: Dict[str, float] = {
        "anomaly": min(45.0, anomaly.score * 0.45),
        "amount_pressure": min(30.0, amount / 500.0),
        "history": min(25.0, prior_rejections * 8.0),
    }
    total = min(99.0, sum(factors.values()) + 5.0)
    flags = list(anomaly.flags)
    if prior_rejections >= 2:
        flags.append("REPEAT_SUBMITTER_HISTORY")
    return RiskBreakdown(total=round(total, 2), factors=factors, flags=flags)


if __name__ == "__main__":
    rb = score_expense(2400.0, "TRAVEL", [200, 350, 420], merchant="Airline X")
    print(rb)
