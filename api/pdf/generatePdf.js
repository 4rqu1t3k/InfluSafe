const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createReport = async (data, target) => {
    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const filePath = path.join(reportsDir, `Influsafe_Audit_${target}_${Date.now()}.pdf`);

    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- ENCABEZADO ---
        doc.fontSize(24).fillColor('#2c3e50').text('Influsafe®', { align: 'center' });
        doc.fontSize(10).text('Identity Protection & Revenue Assurance System', { align: 'center' });
        doc.moveDown();

        // --- SCORE VISUAL ---
        const score = data.puntuacion_riesgo || 0;
        doc.fontSize(14).text(`Objetivo: ${target}`, { align: 'left' });
        
        // Barra de riesgo
        doc.rect(50, doc.y + 10, 500, 20).fill('#ecf0f1');
        const color = score > 80 ? '#c0392b' : (score > 40 ? '#f39c12' : '#27ae60');
        doc.rect(50, doc.y + 10, (score/100)*500, 20).fill(color);
        doc.fillColor('white').text(`${score}% RIESGO`, 60, doc.y - 15);
        doc.moveDown(3).fillColor('black');

        // --- HALLAZGOS ---
        data.analisis.forEach((item, i) => {
            doc.fontSize(12).fillColor('#2980b9').text(`VULNERABILIDAD ${i+1}: ${item.problema.toUpperCase()}`);
            doc.moveDown(0.2);
            
            doc.fontSize(10).fillColor('#333');
            doc.font('Helvetica-Bold').text('Riesgo/Consecuencia: ').font('Helvetica').text(item.consecuencias);
            doc.font('Helvetica-Bold').text('Solución Técnica: ').font('Helvetica').text(item.solucion);
            
            // Caja de explicación humana
            doc.moveDown(0.5);
            doc.fillColor('#7f8c8d').font('Helvetica-Oblique').text(`Impacto en tu carrera: ${item.explicacion_humana}`);
            doc.moveDown(1.5).fillColor('black');
        });

        // --- SECCIÓN DE ORO: MONETIZACIÓN ---
        doc.addPage();
        doc.rect(50, 50, 500, 100).fill('#f1c40f'); // Fondo dorado
        doc.fillColor('#2c3e50').fontSize(16).text('OPORTUNIDAD DE MONETIZACIÓN', 70, 70);
        doc.fontSize(12).text(data.consejo_monetizacion || "Optimiza tu seguridad para crecer.", 70, 100, { width: 460 });

        // --- CONCLUSIÓN ---
        doc.moveDown(5);
        doc.fillColor('black').fontSize(14).text('Dictamen Final del Arquitecto', { underline: true });
        doc.fontSize(11).text(data.opinion_tecnica_final);

        doc.end();
        stream.on('finish', () => resolve(filePath));
    });
};