const evidenceScore = require("../scoring/scoring/evidence_score.js");

/**
 * Capa de contenido
 * Evalúa calidad y consistencia del contenido público
 */
module.exports = function content(input) {
  const score = evidenceScore(input);

  return {
    name: "content",
    score,
    findings: [
      score > 70
        ? "Contenido consistente y alineado"
        : "Contenido irregular o sin estrategia clara"
    ]
  };
};
