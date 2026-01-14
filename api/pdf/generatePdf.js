const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

module.exports = function generatePdf(result) {
  const reportsDir = path.join(__dirname, "..", "..", "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  const filename = `InfluSafe_Dictamen_${Date.now()}.pdf`;
  const filePath = path.join(reportsDir, filename);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  const title = (text) =>
    doc.moveDown(1).fontSize(14).text(text, { underline: true });

  const body = (text) =>
    doc.moveDown(0.5).fontSize(11).text(text, { align: "justify" });

  // PORTADA
  doc.fontSize(18).text("DICTAMEN INTEGRAL DE PRESENCIA DIGITAL", {
    align: "center",
  });
  doc.moveDown(2);

  body(`Nombre evaluado: ${result.identidad.nombre_evaluado}`);
  body(`Activo principal analizado: ${result.identidad.url_principal}`);
  body(`Fecha de análisis: ${result.meta.fecha}`);
  body(`Versión del dictamen: ${result.meta.version}`);

  // METODOLOGÍA
  title("Metodología aplicada");
  body(
    "Este dictamen se basa en un análisis preventivo de presencia digital que evalúa identidad, activos públicos, exposición, reputación, monetización y riesgos asociados. El enfoque es técnico, no intrusivo y orientado a prevención."
  );

  // IDENTIDAD
  title("Identidad digital");
  body(`Estado: ${result.identidad.coherencia_identidad.estado}`);
  body(`Riesgo: ${result.identidad.coherencia_identidad.riesgo}`);
  body(`Recomendación: ${result.identidad.coherencia_identidad.recomendacion}`);

  // PRESENCIA WEB
  title("Presencia web");
  body(`Estado: ${result.presencia_web.accesibilidad}`);
  body(`Observaciones: ${result.presencia_web.observaciones}`);
  body(`Riesgo: ${result.presencia_web.riesgo}`);
  body(`Impacto: ${result.presencia_web.impacto}`);
  body(`Recomendación: ${result.presencia_web.recomendacion}`);

  // REDES SOCIALES
  title("Redes sociales analizadas");
  result.redes_sociales.forEach((red) => {
    doc.moveDown(0.5).fontSize(12).text(red.red);
    body(`Estado: ${red.estado}`);
    body(`Nivel de exposición: ${red.nivel_exposicion}`);
    body(`Riesgo de suplantación: ${red.riesgo_suplantacion}`);
    body(`Riesgo reputacional: ${red.riesgo_reputacional}`);
    body(`Observaciones: ${red.observaciones}`);
    body(`Recomendación: ${red.recomendacion}`);
  });

  // SEGURIDAD DIGITAL
  title("Seguridad digital");
  body(`Superficie de ataque: ${result.seguridad_digital.superficie_ataque}`);
  body(
    `Probabilidad de suplantación: ${result.seguridad_digital.probabilidad_suplantacion}`
  );
  body(
    `Vectores comunes detectados: ${result.seguridad_digital.vectores_comunes.join(
      ", "
    )}`
  );
  body(`Consecuencia: ${result.seguridad_digital.consecuencia}`);
  body(
    `Medidas preventivas: ${result.seguridad_digital.medidas_preventivas}`
  );

  // REPUTACIÓN
  title("Reputación digital");
  body(`Control narrativo: ${result.reputacion_digital.control_narrativa}`);
  body(`Riesgos detectados: ${result.reputacion_digital.riesgos_terceros}`);
  body(`Impacto en confianza: ${result.reputacion_digital.impacto_confianza}`);
  body(`Recomendación: ${result.reputacion_digital.recomendacion}`);

  // MONETIZACIÓN
  title("Monetización y riesgo financiero");
  body(`Modelo de ingresos: ${result.monetizacion.modelo_ingresos_probable}`);
  body(
    `Dependencia del activo digital: ${result.monetizacion.dependencia_activo_digital}`
  );
  body(`Riesgo financiero: ${result.monetizacion.riesgo_financiero}`);
  body(`Oportunidad perdida: ${result.monetizacion.oportunidad_perdida}`);
  body(
    `Recomendación: ${result.monetizacion.recomendacion_proteccion}`
  );

  // IMPACTO ECONÓMICO
  title("Impacto económico");
  body(result.impacto_economico.impacto_si_no_se_atiende);
  body(result.impacto_economico.impacto_si_se_corrige);
  body(result.impacto_economico.nota_metodologica);

  // ESTRATEGIA
  title("Estrategia de crecimiento protegida");
  body(result.estrategia_crecimiento.observacion);
  body(result.estrategia_crecimiento.oportunidad);
  body(result.estrategia_crecimiento.riesgo_sin_blindaje);
  body(result.estrategia_crecimiento.sugerencia);

  // CONCLUSIÓN
  title("Conclusión ejecutiva");
  body(`Estado general: ${result.conclusion.estado_general}`);
  body(`Nivel de riesgo: ${result.conclusion.nivel_riesgo}`);
  body(`Prioridad: ${result.conclusion.prioridad}`);
  body(`Siguiente paso: ${result.conclusion.siguiente_paso}`);

  // MONITOREO
  title("Monitoreo y blindaje preventivo");
  body(result.monitoreo.justificacion);
  body(`Se monitorea: ${result.monitoreo.que_se_monitorea}`);
  body(`Beneficio: ${result.monitoreo.beneficio}`);

  doc.end();

  return `/reports/${filename}`;
};
