require('dotenv').config();
const express = require('express');
const orchestrator = require('./core/orchestrator');
const app = express();

app.use(express.json());
// Servir archivos estáticos (Frontend)
app.use(express.static('public'));

// Endpoint Principal de Influsafe
app.post('/analyze', async (req, res) => {
    try {
        const { url, nombre } = req.body;
        if (!url) return res.status(400).json({ ok: false, error: "URL is required" });

        // The orchestrator now uses the 'nombre' to generate a more dynamic profile
        const result = await orchestrator.runAnalysis(url, nombre);

        res.json({
            ok: true,
            ...result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`> Influsafe® System Active on Port ${PORT}`);
    console.log(`> Module: Digital Exposure & Identity Risk`);
});