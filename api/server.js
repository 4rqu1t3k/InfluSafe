const express = require("express");
const cors = require("cors");
const path = require("path");

console.log("🔥 SERVER.JS REAL EJECUTÁNDOSE 🔥");

// Motor de análisis
const analyzeV2 = require("./analyze_v2.js");

// Generador de PDF
const generatePdf = require("./pdf/generatePdf.js");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Endpoint principal
app.post("/analyze", (req, res) => {
  try {
    const input = req.body;

    if (!input.url) {
      return res.status(400).json({ error: "URL requerida" });
    }

    const analysisResult = analyzeV2(input);

    const reportPath = generatePdf({
      ...analysisResult,
      nombre: input.nombre || "No especificado"
    });

    res.json({
      ok: true,
      report: reportPath,
      result: analysisResult
    });
  } catch (error) {
    console.error("🔥 ERROR ANALYZE REAL 🔥");
    console.error(error);

    res.status(500).json({
      error: "Error interno InfluSafe",
      detail: error.message
    });
  }
});

// Arranque servidor
app.listen(PORT, () => {
  console.log(`InfluSafe API corriendo en http://localhost:${PORT}`);
});
