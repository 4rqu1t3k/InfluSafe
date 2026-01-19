function generateTechnicalOpinion(scoringResult, context) {
    const { totalScore, riskLevel } = scoringResult;
    const { profileType, digitalDependency, identityStatus, hasVerification, hasSensitiveTopics } = context;

    let opinion = `Análisis técnico para perfil ${profileType} con dependencia digital ${digitalDependency}. `;

    if (identityStatus === 'consistent') {
        opinion += 'La identidad digital es consistente. ';
    } else {
        opinion += 'Se detectan inconsistencias en la identidad digital. ';
    }

    if (hasVerification) {
        opinion += 'El perfil cuenta con verificación. ';
    } else {
        opinion += 'No se detecta verificación oficial. ';
    }

    if (hasSensitiveTopics) {
        opinion += 'Se identifican temas sensibles que requieren atención. ';
    }

    opinion += `Nivel de riesgo: ${riskLevel} (Puntuación: ${totalScore}/100). `;

    if (totalScore > 75) {
        opinion += 'Recomendación: Implementar medidas de protección inmediata.';
    } else if (totalScore > 50) {
        opinion += 'Recomendación: Monitoreo continuo y mejoras en seguridad.';
    } else {
        opinion += 'Recomendación: Mantener buenas prácticas de seguridad.';
    }

    return opinion;
}

module.exports = { generateTechnicalOpinion };