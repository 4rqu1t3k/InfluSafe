const evidenceScore = require("../scoring/scoring/evidence_score.js");

/**
 * Capa de reputación
 * Evalúa percepción pública y señales reputacionales básicas
 */
module.exports = function reputation(input) {
  const score = evidenceScore(input);

  return {
    name: "reputation",
    score,
    findings: [
      score > 70
        ? "Reputación digital favorable"
        : "Riesgos reputacionales detectados"
    ]
  };
};
