const { generateRiskScore } = require('../scoring/engine/riskScoringEngineV2');
const { generateTechnicalOpinion } = require('../scoring/engine/opinionGenerator');
const { analyzeWebSecurity } = require('../../scanners/webScanner');

// This is a placeholder function to generate a profile input based on the target.
// In a real scenario, this data would come from a database or a more sophisticated analysis.
function generateProfileInput(target) {
    const lowerCaseTarget = target.toLowerCase();
    let profileType = 'professional';
    let digitalDependency = 'medium';
    let usagePurpose = 'personal_branding';

    // Generate a hash-like value to make profiles unique
    const hash = lowerCaseTarget.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    // Use hash to vary the profile
    const types = ['professional', 'influencer', 'brand', 'public_figure'];
    const dependencies = ['low', 'medium', 'high'];
    const purposes = ['personal_branding', 'business', 'entertainment', 'education'];

    profileType = types[Math.abs(hash) % types.length];
    digitalDependency = dependencies[Math.abs(hash + 1) % dependencies.length];
    usagePurpose = purposes[Math.abs(hash + 2) % purposes.length];

    // Specific overrides for known targets
    if (lowerCaseTarget.includes('karely') || lowerCaseTarget.includes('ruiz')) {
        profileType = 'public_sensitive';
        digitalDependency = 'high';
    } else if (lowerCaseTarget.includes('hector') && lowerCaseTarget.includes('samperio')) {
        profileType = 'brand';
        digitalDependency = 'high';
        usagePurpose = 'business';
    }

    return {
        profileType,
        usagePurpose,
        digitalDependency,
        profileStage: hash % 2 === 0 ? 'stable' : 'growing',
        visibilitySignals: {
            postingFrequency: dependencies[Math.abs(hash + 3) % dependencies.length],
            nameClarity: hash % 3 === 0 ? 'unique' : hash % 3 === 1 ? 'semi_unique' : 'common',
            crossPlatformLinks: hash % 2 === 0,
        },
    };
}


async function runAnalysis(url, nombre) {
    const profileInput = generateProfileInput(nombre || '');

    const webSecurityReport = await analyzeWebSecurity(url);

    const diagnostic = {
        identityStatus: webSecurityReport.score > 80 ? 'consistent' : 'inconsistent',
        hasVerification: webSecurityReport.ssl.valid,
        hasSensitiveTopics: webSecurityReport.vulnerabilities.some(v => v.severity === 'Critical' || v.severity === 'High'),
        hasControversyHistory: webSecurityReport.score < 50, // Simulate based on score
    };

    const scoringResult = generateRiskScore(profileInput, diagnostic);
    const aiSummary = generateTechnicalOpinion(scoringResult, scoringResult.context);

    const reportPath = `/reports/Dictamen_${nombre}.pdf`;

    return {
        reportPath,
        aiSummary,
        scoringResult,
        webSecurityReport
    };
}

module.exports = { runAnalysis };