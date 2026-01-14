const evidenceScore = require("../scoring/scoring/evidence_score.js");

/**
 * Capa de exposición
 * Evalúa qué tan expuesto está el perfil en la web
 */
module.exports = function exposure(input) {
  const score = evidenceScore(input);

  return {
    name: "exposure",
    score,
    findings: [
      score > 70
        ? "Exposición controlada"
        : "Alta exposición pública sin control"
    ]
  };
};
