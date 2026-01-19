/**
 * evidence_score
 * Calcula un puntaje base (0–100) a partir de señales simples
 * Esta función es intencionalmente sencilla para aprendizaje
 */

module.exports = function evidenceScore(input) {
  let score = 0;

  // Señal 1: existe URL
  if (input && input.url) {
    score += 30;
  }

  // Señal 2: tipo de análisis definido
  if (input && input.tipo) {
    score += 20;
  }

  // Señal 3: estructura mínima válida
  if (typeof input === "object") {
    score += 20;
  }

  // Señal 4: placeholder de reputación futura
  score += 10;

  // Normalizar a máximo 100
  if (score > 100) score = 100;

  return score;
};
