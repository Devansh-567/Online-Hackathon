"""
Heuristic anomaly detection for expense lines.
Suitable for batch scoring pipelines and model feature extraction.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Sequence


@dataclass
class AnomalyResult:
    score: float  # 0..100 higher = more anomalous
    flags: List[str]


def zscore_magnitude(values: Sequence[float], value: float) -> float:
    """Simple z-score magnitude without scipy (demo)."""
    if not values:
        return 0.0
    mean = sum(values) / len(values)
    var = sum((x - mean) ** 2 for x in values) / max(len(values), 1)
    std = var**0.5 or 1e-6
    return abs(value - mean) / std


def detect_anomalies(
    amount: float,
    category: str,
    peer_amounts: Sequence[float],
    merchant: str | None = None,
) -> AnomalyResult:
    """Flag statistical and rule-based anomalies."""
    flags: List[str] = []
    score = 5.0

    z = zscore_magnitude(peer_amounts, amount)
    if z > 2.5:
        flags.append("STATISTICAL_OUTLIER")
        score += min(40.0, z * 10)

    if category.upper() == "MEALS" and amount > 500:
        flags.append("HIGH_MEAL_SPEND")
        score += 15.0

    if merchant and any(x in merchant.lower() for x in ("test", "dummy", "fake")):
        flags.append("SUSPICIOUS_MERCHANT_STRING")
        score += 25.0

    return AnomalyResult(score=min(100.0, score), flags=flags)


if __name__ == "__main__":
    demo = detect_anomalies(820.0, "MEALS", [40, 55, 60, 48, 90], merchant="Cafe Noir")
    print(demo)
