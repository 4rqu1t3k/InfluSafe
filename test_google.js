const { GoogleGenerativeAI } = require("@google/generative-ai");


const API_KEY = "AIzaSyCuk5eOJ0gS6Y3MIcK7X4qy0IKNIOXDYe4"; 

async function probar() {
    console.log("📡 Intentando conectar con Google Gemini...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Di 'HOLA' si me escuchas.");
        console.log("✅ ÉXITO TOTAL: La IA respondió ->", result.response.text());
    } catch (error) {
        console.log("❌ ERROR DE GOOGLE:", error.message);
    }
}
probar();