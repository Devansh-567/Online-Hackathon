"""
Lightweight prediction utilities (placeholder for sklearn/torch models).
Exports JSON-friendly prediction for orchestration services.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass

from risk_scoring import score_expense
from trust_score import compute_trust


@dataclass
class PredictionPayload:
    likely_fraud: bool
    recommended_action: str
    risk: dict
    trust: dict


def predict_expense_outcome(
    amount: float,
    category: str,
    peer_amounts: list[float],
    merchant: str | None,
    role: str,
    tenure_months: int,
    approval_rate: float,
    prior_rejections: int,
) -> PredictionPayload:
    """
    Deterministic ensemble for demo; swap with trained classifier probabilities.
    """
    rb = score_expense(amount, category, peer_amounts, merchant, prior_rejections)
    tp = compute_trust(role, tenure_months, approval_rate, dispute_count=prior_rejections)

    combined = rb.total - (tp.final - 60.0) * 0.35
    likely_fraud = combined >= 72.0
    if likely_fraud:
        action = "ESCALATE"
    elif combined <= 38.0:
        action = "AUTO_APPROVE"
    else:
        action = "STANDARD_REVIEW"

    return PredictionPayload(
        likely_fraud=likely_fraud,
        recommended_action=action,
        risk=asdict(rb),
        trust=asdict(tp),
    )


def main_cli() -> None:
    payload = predict_expense_outcome(
        180.0,
        "MEALS",
        [40, 60, 55, 70],
        "Bistro",
        "EMPLOYEE",
        tenure_months=10,
        approval_rate=0.9,
        prior_rejections=0,
    )
    print(json.dumps(asdict(payload), indent=2))


if __name__ == "__main__":
    main_cli()
