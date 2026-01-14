const evidenceScore = require("../scoring/scoring/evidence_score.js");

/**
 * Capa de identidad
 * Evalúa señales básicas de identidad digital
 */
module.exports = function identity(input) {
  const score = evidenceScore(input);

  return {
    name: "identity",
    score,
    findings: [
      score > 70
        ? "Identidad digital consistente"
        : "Identidad digital débil o poco clara"
    ]
  };
};
