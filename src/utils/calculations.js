export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function percent(current, max) {
  if (!max) return 0
  return clamp((current / max) * 100, 0, 100)
}

export function formatNumber(value, digits = 0) {
  return Number(value).toFixed(digits)
}
