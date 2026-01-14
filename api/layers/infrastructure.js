/**
 * Orchestrator InfluSafe
 * Consolida resultados de capas y calcula métricas globales
 * CommonJS puro, alineado con la estructura real del proyecto
 */

module.exports = function orchestrator(layers) {
  let totalScore = 0;
  let layerCount = 0;

  Object.keys(layers).forEach((key) => {
    if (layers[key] && typeof layers[key].score === "number") {
      totalScore += layers[key].score;
      layerCount++;
    }
  });

  const globalScore =
    layerCount > 0 ? Math.round(totalScore / layerCount) : 0;

  return {
    global_score: globalScore,
    coverage: layerCount,
    evaluated_layers: Object.keys(layers)
  };
};
