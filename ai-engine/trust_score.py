"""
Employee / vendor trust scoring — complements risk (high trust lowers review friction).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class TrustProfile:
    base: float
    adjustments: dict[str, float]
    final: float


def compute_trust(
    role: str,
    tenure_months: int,
    approval_rate: float,
    dispute_count: int,
) -> TrustProfile:
    """Compute trust score used to modulate automated approvals."""
    base = 60.0
    adjustments: dict[str, float] = {}
    if role.upper() == "MANAGER":
        adjustments["role"] = 12.0
    if role.upper() == "ADMIN":
        adjustments["role"] = 8.0
    adjustments["tenure"] = min(15.0, tenure_months / 4.0)
    adjustments["quality"] = (approval_rate - 0.85) * 40.0
    adjustments["disputes"] = -dispute_count * 6.0

    final = base + sum(adjustments.values())
    final = max(20.0, min(99.0, final))
    return TrustProfile(base=base, adjustments=adjustments, final=round(final, 2))


if __name__ == "__main__":
    print(compute_trust("EMPLOYEE", 14, 0.92, 0))
