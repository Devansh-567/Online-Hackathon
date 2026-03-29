"""Basic tests for AI heuristics."""

import unittest
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "ai-engine"
sys.path.insert(0, str(ROOT))

from anomaly_detection import detect_anomalies  # noqa: E402
from trust_score import compute_trust  # noqa: E402


class TestAI(unittest.TestCase):
    def test_anomaly_flags_high_meal(self):
        result = detect_anomalies(900, "MEALS", [40, 50, 45, 60], merchant="Cafe")
        self.assertGreaterEqual(result.score, 10)

    def test_trust_increases_for_manager(self):
        t = compute_trust("MANAGER", 12, 0.95, 0)
        self.assertGreater(t.final, 70)


if __name__ == "__main__":
    unittest.main()
