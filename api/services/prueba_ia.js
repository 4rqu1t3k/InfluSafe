// Archivo: prueba_ia.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Pon tu clave AQUÍ entre las comillas
const genAI = new GoogleGenerativeAI("AIzaSyCuk5eOJ0gS6Y3MIcK7X4qy0IKNIOXDYe4");
async function probarConexion() {
    console.log("----------------------------------------");
    console.log("📡 Iniciando prueba de conexión con Google Gemini...");
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("🔄 Enviando mensaje de prueba...");
        const result = await model.generateContent("Responde solo con la palabra: CONECTADO");
        const response = await result.response;
        const text = response.text();

        console.log("----------------------------------------");
        console.log("✅ ¡ÉXITO! La IA respondió:", text);
        console.log("👉 Tu clave funciona perfectamente.");
        console.log("----------------------------------------");

    } catch (error) {
        console.log("----------------------------------------");
        console.log("❌ ERROR DETECTADO:");
        console.error(error.message); // Esto nos dirá la causa exacta
        
        if (error.message.includes("API_KEY_INVALID")) {
            console.log("💡 SOLUCIÓN: La clave está mal copiada o fue borrada.");
        } else if (error.message.includes("check that the API is enabled")) {
            console.log("💡 SOLUCIÓN: Debes habilitar la API en Google Cloud Console.");
        } else if (error.message.includes("quota")) {
            console.log("💡 SOLUCIÓN: Se acabó tu cuota gratuita o falta activar facturación.");
        }
        console.log("----------------------------------------");
    }
}

probarConexion();