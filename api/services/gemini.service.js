const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config();

// --- ZONA DE CLAVE ---

const genAI = new GoogleGenerativeAI(""); 
// ---------------------

exports.analyzeRiskData = async (technicalData) => {
    // 1. Configuración de Seguridad
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        safetySettings: safetySettings 
    });

    // 2. DETECCIÓN DE TIPO DE CLIENTE
    const clientType = technicalData.type || "influencer";
    
    const strategies = {
        "influencer": "PROTECCIÓN DE INGRESOS. Foco: Robo de Instagram/TikTok y patrocinios.",
        "politico": "REPUTACIÓN Y ANTI-FILTRACIÓN. Foco: Privacidad de WhatsApp, Deepfakes y Fake News.",
        "marca": "CONTINUIDAD DE NEGOCIO. Foco: Business Manager, estafas a clientes y pasarelas de pago.",
        "vip": "PRIVACIDAD TOTAL. Foco: Doxing, ubicación y seguridad familiar."
    };

    const strategyContext = strategies[clientType] || strategies["influencer"];

    // 3. PROMPT AVANZADO MULTI-RED
    const prompt = `
    Eres Influsafe®, consultor de ciberinteligencia.
    Auditas a un cliente tipo: **${clientType.toUpperCase()}**.
    
    OBJETIVO: "${technicalData.target}"
    CONTEXTO: ${strategyContext}

    REDES A ANALIZAR: Instagram, TikTok, X, YouTube, Facebook, WhatsApp, Web.

    DATOS TÉCNICOS:
    - ID: ${JSON.stringify(technicalData.layers.idData)}
    - Web: ${JSON.stringify(technicalData.layers.infraData)}
    - Rep: ${JSON.stringify(technicalData.layers.repData)}

    INSTRUCCIONES:
    1. Piensa como atacante de un **${clientType}**.
    2. Genera 3 vulnerabilidades críticas.
    3. Responde SOLO JSON válido.

    ESTRUCTURA JSON:
    {
      "puntuacion_riesgo": (0-100),
      "perfil_cliente": "${clientType}",
      "analisis": [
        {
          "red_afectada": "Red social afectada",
          "problema": "Riesgo detectado",
          "consecuencias": "Daño específico al perfil",
          "solucion": "Solución técnica",
          "explicacion_humana": "Explicación sencilla"
        }
      ],
      "consejo_monetizacion": "Estrategia de negocio basada en seguridad",
      "opinion_tecnica_final": "Resumen ejecutivo"
    }
    `;

    try {
        console.log(`>> 🧠 Influsafe: Analizando [${clientType}]...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpieza de JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Formato inválido de IA");
        
        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error("⚠️ Error en IA:", error.message);
        return {
            puntuacion_riesgo: 85,
            perfil_cliente: clientType,
            analisis: [{
                red_afectada: "General",
                problema: "Error de Conexión",
                consecuencias: "No se pudo procesar con IA Real.",
                solucion: "Verificar Clave API en código.",
                explicacion_humana: "Modo de respaldo activado."
            }],
            consejo_monetizacion: "Reintentar.",
            opinion_tecnica_final: "Fallo de conexión."
        };
    }
};