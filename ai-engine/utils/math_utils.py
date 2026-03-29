"""Small numerical helpers for AI pipelines (clamping, winsorization)."""

from __future__ import annotations

from typing import Iterable, List


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def winsorize(values: Iterable[float], p: float = 0.1) -> List[float]:
    """Crude winsorization for heavy-tailed peer groups."""
    xs = sorted(values)
    if not xs:
        return []
    k = max(1, int(len(xs) * p))
    lo, hi = xs[k - 1], xs[-k]
    return [clamp(v, lo, hi) for v in xs]
