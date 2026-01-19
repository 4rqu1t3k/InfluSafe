const axios = require('axios');
const sslChecker = require('ssl-checker');

/**
 * Módulo de Escaneo de Seguridad Web 
 * Analiza cabeceras de seguridad y estado SSL para el reporte de Blindaje Digital.
 */

async function analyzeWebSecurity(targetUrl) {
    
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    const report = {
        target: targetUrl,
        scanDate: new Date().toISOString(),
        score: 100, // Empezamos con 100 y restamos según hallazgos
        riskLevel: 'Low', // Low, Medium, High, Critical
        ssl: {
            valid: false,
            daysRemaining: 0,
            issuer: 'Unknown'
        },
        securityHeaders: [],
        vulnerabilities: []
    };

    console.log(`🔍 Iniciando escaneo web para: ${targetUrl}`);

    try {
        // --- FASE 1: Análisis SSL (El Candado) ---
        // Extraemos el hostname limpio para ssl-checker
        const hostname = new URL(targetUrl).hostname;
        
        try {
            const sslData = await sslChecker(hostname);
            report.ssl = {
                valid: sslData.valid,
                daysRemaining: sslData.daysRemaining,
                issuer: sslData.issuer ? sslData.issuer.O || sslData.issuer.CN : 'Unknown' // Organización o Common Name
            };

            if (!report.ssl.valid || report.ssl.daysRemaining < 0) {
                report.score -= 40;
                report.vulnerabilities.push({
                    type: 'SSL_INVALID',
                    severity: 'Critical',
                    description: 'El certificado SSL es inválido o ha expirado. El sitio no es seguro.'
                });
            } else if (report.ssl.daysRemaining < 14) {
                report.score -= 10;
                report.vulnerabilities.push({
                    type: 'SSL_EXPIRING_SOON',
                    severity: 'Medium',
                    description: `El certificado SSL expira en ${report.ssl.daysRemaining} días.`
                });
            }
        } catch (sslError) {
            report.score -= 40;
            report.vulnerabilities.push({
                type: 'SSL_ERROR',
                severity: 'Critical',
                description: 'No se pudo verificar el certificado SSL. Posiblemente inexistente.'
            });
        }

        // --- FASE 2: Cabeceras de Seguridad (Security Headers) ---
        const response = await axios.get(targetUrl, {
            timeout: 10000, // 10 segundos máximo
            validateStatus: () => true // Analizar incluso si da error 404 o 500
        });

        const headers = response.headers;

        // Lista de cabeceras críticas a verificar
        const checks = [
            {
                key: 'strict-transport-security',
                name: 'HSTS',
                missingRisk: 'High',
                penalty: 20,
                desc: 'Permite ataques de downgrade (HTTP) y secuestro de sesión.'
            },
            {
                key: 'content-security-policy',
                name: 'CSP',
                missingRisk: 'Medium',
                penalty: 15,
                desc: 'Falta protección contra ataques de Cross-Site Scripting (XSS).'
            },
            {
                key: 'x-frame-options',
                name: 'X-Frame-Options',
                missingRisk: 'Medium',
                penalty: 15,
                desc: 'Vulnerable a Clickjacking (tu web podría ser incrustada en un iframe malicioso).'
            },
            {
                key: 'x-content-type-options',
                name: 'X-Content-Type',
                missingRisk: 'Low',
                penalty: 5,
                desc: 'Riesgo de MIME-Sniffing (el navegador podría ejecutar archivos disfrazados).'
            },
            {
                key: 'server',
                name: 'Server Disclosure',
                isRiskIfPresent: true, // Es un riesgo si ESTÁ presente (revela tecnología)
                penalty: 5,
                desc: 'El servidor revela su versión exacta, facilitando ataques dirigidos.'
            }
        ];

        checks.forEach(check => {
            const headerValue = headers[check.key];

            if (check.isRiskIfPresent) {
                // Caso especial: No queremos que "Server" o "X-Powered-By" existan
                if (headerValue) {
                    report.score -= check.penalty;
                    report.vulnerabilities.push({
                        type: 'INFO_LEAK',
                        severity: 'Low',
                        description: `Fuga de información: ${check.name} revela "${headerValue}".`
                    });
                }
            } else {
                // Caso normal: 
                if (!headerValue) {
                    report.score -= check.penalty;
                    report.securityHeaders.push({ name: check.name, status: 'MISSING' });
                    report.vulnerabilities.push({
                        type: `MISSING_${check.name}`,
                        severity: check.missingRisk,
                        description: check.desc
                    });
                } else {
                    report.securityHeaders.push({ name: check.name, status: 'OK', value: headerValue });
                }
            }
        });

    } catch (error) {
        // Error general de conexión (sitio caído, DNS, timeout)
        report.score = 0;
        report.riskLevel = 'Critical';
        report.error = error.message;
        report.vulnerabilities.push({
            type: 'SITE_UNREACHABLE',
            severity: 'Critical',
            description: 'No se pudo acceder al sitio web. Verifique la URL o si el servidor está caído.'
        });
    }

    // --- FASE 3: Cálculo Final del Nivel de Riesgo ---
    if (report.score < 50) report.riskLevel = 'Critical';
    else if (report.score < 75) report.riskLevel = 'High';
    else if (report.score < 90) report.riskLevel = 'Medium';
    else report.riskLevel = 'Low'; // Blindado

    return report;
}

module.exports = { analyzeWebSecurity };