
const { PROFILE_WEIGHTS } = require("./weights");
const { clamp, assert } = require("./validators");


function calculateVisibilityScore(signals = {}) {
  let score = 0;

  if (signals.postingFrequency === "high") score += 4;
  if (signals.postingFrequency === "medium") score += 2;

  if (signals.nameClarity === "unique") score += 3;
  if (signals.nameClarity === "semi_unique") score += 1;

  if (signals.crossPlatformLinks === true) score += 2;

  return score; // rango típico: 0–9
}

function mapVisibilityLevel(score) {
  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

function buildProfileContext(profileInput) {
  const visibilityScore = calculateVisibilityScore(
    profileInput.visibilitySignals
  );

  return {
    profileType: profileInput.profileType,
    usagePurpose: profileInput.usagePurpose,
    digitalDependency: profileInput.digitalDependency,
    profileStage: profileInput.profileStage,
    visibilityScore,
    visibilityLevel: mapVisibilityLevel(visibilityScore)
  };
}

/* =========================
   SCORING POR DIMENSIÓN
========================= */

function scoreImpersonation(context, diagnostic) {
  let score = 0;

  if (context.visibilityLevel === "high") score += 4;
  if (context.visibilityLevel === "medium") score += 2;

  if (diagnostic.identityStatus === "consistent") score += 1;
  if (diagnostic.identityStatus === "inconsistent") score += 3;

  if (diagnostic.hasVerification === false) score += 2;

  return {
    score: clamp(score),
    justification:
      "Visibilidad del perfil, consistencia de identidad y ausencia de verificación"
  };
}

function scoreReputation(context, diagnostic) {
  let score = 0;

  if (context.profileType === "public_sensitive") score += 5;
  if (context.profileType === "brand") score += 4;
  if (context.profileType === "professional") score += 2;

  if (diagnostic.hasSensitiveTopics) score += 3;
  if (diagnostic.hasControversyHistory) score += 2;

  return {
    score: clamp(score),
    justification:
      "Tipo de perfil, exposición narrativa y sensibilidad del contenido"
  };
}

function scoreImpact(context) {
  let score = 0;

  if (context.digitalDependency === "high") score += 6;
  if (context.digitalDependency === "medium") score += 4;
  if (context.digitalDependency === "low") score += 2;

  if (context.profileStage === "expansion") score += 2;

  return {
    score: clamp(score),
    justification:
      "Dependencia del activo digital y etapa de desarrollo del perfil"
  };
}

function scoreUrgency(context, impersonation, reputation, impact) {
  let base = Math.max(impersonation.score, reputation.score);

  if (impact.score >= 6) base += 2;
  if (context.profileStage === "expansion") base += 1;

  return {
    score: clamp(base),
    justification:
      "Derivada del riesgo dominante y del impacto potencial del perfil"
  };
}

/* =========================
   MATRIZ DE RIESGO
========================= */

function calculateRiskMatrix(context, diagnostic) {
  const impersonation = scoreImpersonation(context, diagnostic);
  const reputation = scoreReputation(context, diagnostic);
  const impact = scoreImpact(context);
  const urgency = scoreUrgency(
    context,
    impersonation,
    reputation,
    impact
  );

  return {
    impersonation,
    reputation,
    impact,
    urgency
  };
}

/* =========================
   SCORE FINAL Y PRIORIDAD
========================= */

function calculateWeightedScore(context, riskMatrix) {
  const weights = PROFILE_WEIGHTS[context.profileType];

  assert(weights, "Profile type without weights");

  let finalScore =
    riskMatrix.impersonation.score * weights.impersonation +
    riskMatrix.reputation.score * weights.reputation +
    riskMatrix.impact.score * weights.impact +
    riskMatrix.urgency.score * weights.urgency;

  // Anti-empate suave (no perceptible)
  finalScore += context.visibilityScore * 0.01;

  return Number(finalScore.toFixed(2));
}

function determinePriority(finalScore) {
  if (finalScore >= 7.5) return "high";
  if (finalScore >= 4.5) return "medium";
  return "low";
}

/* =========================
   VALIDACIONES
========================= */

function validateRiskMatrix(riskMatrix) {
  Object.entries(riskMatrix).forEach(([key, data]) => {
    assert(
      typeof data.score === "number",
      `Score missing for ${key}`
    );
    assert(
      data.justification,
      `Justification missing for ${key}`
    );
  });
}

/* =========================
   EXPORT PRINCIPAL
========================= */

module.exports = function generateRiskScore(profileInput, diagnostic) {
  const context = buildProfileContext(profileInput);
  const riskMatrix = calculateRiskMatrix(context, diagnostic);
  const finalScore = calculateWeightedScore(context, riskMatrix);
  const priority = determinePriority(finalScore);

  validateRiskMatrix(riskMatrix);

  return {
    context,
    riskMatrix,
    finalScore,
    priority
  };
};
