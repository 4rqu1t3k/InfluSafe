export function buildProfileOutput(dictamen, analytics = {}) {
  return {
    meta: {
      generated_at: new Date().toISOString(),
      version: "InfluSafe v2.1",
      confidence: 0.78
    },

    target: {
      url: dictamen.url,
      tipo: dictamen.tipo_analisis,
      nivel_riesgo: dictamen.nivel_riesgo,
      puntaje: dictamen.puntaje
    },

    web_risk: {
      score: dictamen.puntaje,
      findings: dictamen.hallazgos
    },

    social_analytics: analytics.social || {},

    impact_estimation: analytics.impact || {
      monthly_loss_usd: 0,
      annual_loss_usd: 0
    },

    charts: {
      risk_distribution: [],
      content_performance: []
    }
  };
}
