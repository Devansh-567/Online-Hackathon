"""Service wrapper that could load persisted model artifacts from ai-engine/models/."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from prediction_model import predict_expense_outcome


class InferenceService:
    """Loads metadata about model versions; runs deterministic predictor by default."""

    def __init__(self, model_dir: Path | None = None) -> None:
        self.model_dir = model_dir or Path(__file__).resolve().parent.parent / "models"
        self.model_dir.mkdir(parents=True, exist_ok=True)

    def model_manifest(self) -> Dict[str, Any]:
        manifest = self.model_dir / "manifest.json"
        if manifest.exists():
            return json.loads(manifest.read_text(encoding="utf-8"))
        return {"version": "heuristic-v1", "artifact": None}

    def predict(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        p = predict_expense_outcome(
            amount=float(payload["amount"]),
            category=str(payload["category"]),
            peer_amounts=list(payload.get("peer_amounts") or []),
            merchant=payload.get("merchant"),
            role=str(payload.get("role") or "EMPLOYEE"),
            tenure_months=int(payload.get("tenure_months") or 6),
            approval_rate=float(payload.get("approval_rate") or 0.9),
            prior_rejections=int(payload.get("prior_rejections") or 0),
        )
        return {
            "model": self.model_manifest(),
            "prediction": p.__dict__,
        }


if __name__ == "__main__":
    svc = InferenceService()
    print(svc.predict({"amount": 400, "category": "TRAVEL", "peer_amounts": [120, 140, 600]}))
