function normalizeRisk(level) {
  switch (level) {
    case "bajo": return 20;
    case "medio": return 50;
    case "alto": return 80;
    case "critico": return 100;
    default: return 0;
  }
}

function renderCharts(result) {
  const risks = {
    identidad: normalizeRisk(result.layers?.identity?.risk_level),
    redes: normalizeRisk(result.layers?.content?.risk_level),
    tecnica: normalizeRisk(result.layers?.infrastructure?.risk_level),
    reputacion: normalizeRisk(result.layers?.reputation?.risk_level)
  };

  // Gráfica 1 — Riesgo por categoría
  new Chart(document.getElementById("riskChart"), {
    type: "bar",
    data: {
      labels: ["Identidad", "Redes", "Exposición", "Reputación"],
      datasets: [{
        label: "Nivel de riesgo",
        data: Object.values(risks)
      }]
    }
  });

  // Gráfica 2 — Score global
  new Chart(document.getElementById("scoreChart"), {
    type: "doughnut",
    data: {
      labels: ["Score", "Restante"],
      datasets: [{
        data: [result.global_score || 0, 100 - (result.global_score || 0)]
      }]
    }
  });

  // Gráfica 3 — Impacto económico estimado
  new Chart(document.getElementById("moneyChart"), {
    type: "bar",
    data: {
      labels: ["Sin acción", "Con acción"],
      datasets: [{
        label: "Impacto estimado",
        data: [
          result.impact?.loss || 0,
          result.impact?.gain || 0
        ]
      }]
    }
  });
}
