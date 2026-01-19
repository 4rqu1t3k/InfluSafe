module.exports = function generateExecutiveSummary(scoring, context) {
  const { finalScore, priority } = scoring;

  const lines = [];

  lines.push(
    `El perfil evaluado presenta un nivel de riesgo ${priority}, considerando su visibilidad y dependencia del activo digital.`
  );

  if (finalScore >= 7) {
    lines.push(
      "Se identifican vulnerabilidades que requieren atención inmediata para evitar impactos reputacionales o económicos relevantes."
    );
  } else if (finalScore >= 4) {
    lines.push(
      "Los riesgos actuales son controlables, pero podrían escalar si el perfil incrementa su exposición sin medidas preventivas."
    );
  } else {
    lines.push(
      "El perfil mantiene un nivel de riesgo bajo y un margen amplio de control en el estado actual."
    );
  }

  lines.push(
    `La recomendación estratégica es actuar con un enfoque ${priority}, alineado a la etapa del perfil.`
  );

  return lines.join(" ");
};
