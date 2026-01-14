/**
 * Orchestrator InfluSafe
 * Consolida scores de las capas
 * NO importa capas, solo las evalúa
 */

module.exports = function orchestrator(layers) {
  let totalScore = 0;
  let count = 0;

  for (const key in layers) {
    if (
      layers[key] &&
      typeof layers[key].score === "number"
    ) {
      totalScore += layers[key].score;
      count++;
    }
  }

  const globalScore = count > 0 ? Math.round(totalScore / count) : 0;

  return {
    global_score: globalScore,
    coverage: count,
    risk_level:
      globalScore >= 80
        ? "Crítico"
        : globalScore >= 65
        ? "Alto"
        : globalScore >= 45
        ? "Medio–Alto"
        : globalScore >= 30
        ? "Medio"
        : "Bajo"
  };
};
