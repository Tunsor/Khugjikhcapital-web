export function calculatePMT(
  principal: number,
  monthlyRatePercent: number,
  months: number
): number {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(monthlyRatePercent) ||
    !Number.isInteger(months) ||
    principal < 0 ||
    monthlyRatePercent < 0 ||
    months <= 0
  ) {
    return 0;
  }

  const r = monthlyRatePercent / 100;

  if (r === 0) {
    return principal / months;
  }

  return (
    (principal * r) /
    (1 - Math.pow(1 + r, -months))
  );
}
