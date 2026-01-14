
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const path = require("path");

// Tamaño estándar de gráficas para PDF
const WIDTH = 800;
const HEIGHT = 400;

// Inicialización del motor de gráficas
const chartCanvas = new ChartJSNodeCanvas({
  width: WIDTH,
  height: HEIGHT,
  backgroundColour: "white"
});

// Directorio donde se guardan las gráficas
const chartsDir = path.join(__dirname, "../../public/reports/charts");

function ensureChartsDir() {
  if (!fs.existsSync(chartsDir)) {
    fs.mkdirSync(chartsDir, { recursive: true });
  }
}

/**
 * Gráfica 1: Score Global
 */
async function generateGlobalScoreChart(score = 0) {
  ensureChartsDir();

  const configuration = {
    type: "bar",
    data: {
      labels: ["Estado General"],
      datasets: [
        {
          label: "Score Global (0–100)",
          data: [Number(score) || 0],
          backgroundColor: ["#00c853"]
        }
      ]
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          max: 100,
          title: { display: true, text: "Nivel de Seguridad Digital" }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Score Global de Presencia Digital"
        }
      }
    }
  };

  const buffer = await chartCanvas.renderToBuffer(configuration);
  const filePath = path.join(
    chartsDir,
    `score_global_${Date.now()}.png`
  );

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Gráfica 2: Riesgos por Categoría
 */
async function generateRiskByCategoryChart(risks = {}) {
  ensureChartsDir();

  const labels = [
    "Identidad",
    "Exposición",
    "Contenido",
    "Infraestructura",
    "Reputación"
  ];

  const values = [
    risks.identity || 0,
    risks.exposure || 0,
    risks.content || 0,
    risks.infrastructure || 0,
    risks.reputation || 0
  ];

  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Nivel de Riesgo",
          data: values,
          backgroundColor: "#ff5252"
        }
      ]
    },
    options: {
      scales: {
        y: {
          min: 0,
          max: 100,
          title: { display: true, text: "Riesgo (0–100)" }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Distribución de Riesgos por Categoría"
        }
      }
    }
  };

  const buffer = await chartCanvas.renderToBuffer(configuration);
  const filePath = path.join(
    chartsDir,
    `riesgos_categoria_${Date.now()}.png`
  );

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Gráfica 3: Impacto Económico
 */
async function generateEconomicImpactChart(impact = {}) {
  ensureChartsDir();

  const configuration = {
    type: "bar",
    data: {
      labels: ["Pérdida Mensual", "Pérdida Semestral", "Ganancia Potencial"],
      datasets: [
        {
          label: "Monto Estimado (MXN)",
          data: [
            impact.monthly_loss || 0,
            impact.six_month_loss || 0,
            impact.potential_gain || 0
          ],
          backgroundColor: ["#ff9800", "#f44336", "#4caf50"]
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Monto aproximado en MXN" }
        }
      },
      plugins: {
        title: {
          display: true,
          text: "Impacto Económico Estimado por Presencia Digital"
        }
      }
    }
  };

  const buffer = await chartCanvas.renderToBuffer(configuration);
  const filePath = path.join(
    chartsDir,
    `impacto_economico_${Date.now()}.png`
  );

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

module.exports = {
  generateGlobalScoreChart,
  generateRiskByCategoryChart,
  generateEconomicImpactChart
};
