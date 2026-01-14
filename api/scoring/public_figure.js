module.exports = function score(layers) {
  let score = 100;

  Object.values(layers).forEach(layer => {
    if (layer.level === "ALTO") score -= 20;
    if (layer.level === "MEDIO") score -= 10;
  });

  if (score < 0) score = 0;

  return {
    global_score: score,
    status:
      score > 80
        ? "ESTABLE"
        : score > 60
        ? "ATENCIÓN"
        : "RIESGO ELEVADO"
  };
};
