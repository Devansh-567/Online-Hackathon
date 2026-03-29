"""Feature vector construction for downstream ML models."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class ExpenseFeatures:
    amount_log1p: float
    category_onehot: Dict[str, float]
    weekend_submit: float
    ocr_confidence: float


def build_features(amount: float, category: str, weekend: bool, ocr_confidence: float) -> ExpenseFeatures:
    import math

    amount_log1p = math.log1p(max(amount, 0.0))
    cats = ["MEALS", "TRAVEL", "SOFTWARE", "OTHER"]
    category_onehot = {c: 1.0 if c == category.upper() else 0.0 for c in cats}
    return ExpenseFeatures(
        amount_log1p=amount_log1p,
        category_onehot=category_onehot,
        weekend_submit=1.0 if weekend else 0.0,
        ocr_confidence=ocr_confidence,
    )


def flatten_features(f: ExpenseFeatures) -> List[float]:
    flat = [f.amount_log1p, f.weekend_submit, f.ocr_confidence]
    flat.extend(f.category_onehot.values())
    return flat
