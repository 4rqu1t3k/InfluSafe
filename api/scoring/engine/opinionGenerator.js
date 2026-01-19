const toneByProfile = require("./opinionToneByProfile");

function riskLabel(score) {
  if (score >= 7) return "alto";
  if (score >= 4) return "medio";
  return "bajo";
}

function comparisonLabel(finalScore) {
  if (finalScore >= 7) return "por encima del promedio";
  if (finalScore >= 4) return "dentro del promedio";
  return "por debajo del promedio";
}

module.exports = function generateTechnicalOpinion(scoring, context) {
  const { finalScore, riskMatrix } = scoring;
  const tone =
    toneByProfile[context.profileType] ||
    toneByProfile.professional;

  const orderedRisks = Object.entries(riskMatrix).sort(
    (a, b) => b[1].score - a[1].score
  );

  const [mainKey, mainRisk] = orderedRisks[0];
  const [secondaryKey, secondaryRisk] = orderedRisks[1];
  const [lowKey, lowRisk] = orderedRisks[orderedRisks.length - 1];

  const opinion = [];

  // Comparación
  opinion.push(
    `Este perfil se encuentra ${comparisonLabel(finalScore)} en comparación con ${tone.comparisonTarget}, considerando su nivel de visibilidad y dependencia digital.`
  );

  // Riesgo dominante
  opinion.push(
    `El riesgo dominante identificado corresponde a ${mainKey}, con un nivel ${riskLabel(
      mainRisk.score
    )}, asociado a ${mainRisk.justification.toLowerCase()}.`
  );

  // Riesgo secundario
  opinion.push(
    `Como riesgo secundario se observa ${secondaryKey}, con impacto ${riskLabel(
      secondaryRisk.score
    )}, que debe monitorearse sin representar una amenaza inmediata.`
  );

  // Riesgo no crítico
  opinion.push(
    `En contraste, el riesgo vinculado a ${lowKey} se considera ${riskLabel(
      lowRisk.score
    )} y no constituye una prioridad en el estado actual del perfil.`
  );

  // Lectura estratégica
  opinion.push(
    `Desde una perspectiva estratégica, el foco debe mantenerse en ${tone.focus}, ya que cualquier incidente podría afectar ${tone.impact}.`
  );

  if (context.profileStage === "expansion") {
    opinion.push(tone.growthRisk + ".");
  }

  return opinion.join(" ");
};
