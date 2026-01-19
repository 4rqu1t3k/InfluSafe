
function clamp(value, min = 0, max = 10) {
  if (typeof value !== "number") return min;
  return Math.min(Math.max(value, min), max);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`RiskScoringEngineV2 validation error: ${message}`);
  }
}

module.exports = {
  clamp,
  assert
};
