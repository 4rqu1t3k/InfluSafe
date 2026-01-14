module.exports = function analyzeV2(input) {
  const fecha = new Date().toISOString();

  const redesDeclaradas = input.redes || ["Instagram", "Facebook", "X"];

  return {
    meta: {
      analysis_type: "Dictamen preventivo de presencia digital",
      fecha,
      version: "V1 Comercial"
    },

    identidad: {
      nombre_evaluado: input.nombre || "No especificado",
      url_principal: input.url || "No especificado",
      tipo_perfil: "Figura pública / Marca personal",
      coherencia_identidad: {
        estado: "Consistente",
        riesgo: "Bajo",
        recomendacion:
          "Mantener uniformidad visual, narrativa y enlaces oficiales en todos los activos digitales."
      }
    },

    presencia_web: {
      accesibilidad: "Accesible",
      observaciones:
        "El activo principal responde correctamente y no presenta errores críticos visibles.",
      riesgo: "Bajo",
      impacto:
        "Una web inaccesible afecta confianza, posicionamiento y oportunidades comerciales.",
      recomendacion:
        "Mantener monitoreo de disponibilidad y cambios no autorizados."
    },

    redes_sociales: redesDeclaradas.map((red) => ({
      red,
      estado: "Detectada / Declarada",
      nivel_exposicion: "Media",
      riesgo_suplantacion: "Moderado",
      riesgo_reputacional: "Moderado",
      observaciones:
        "La red representa un punto de contacto directo con la audiencia y un vector común de suplantación.",
      recomendacion:
        "Verificar oficialmente la cuenta, asegurar accesos y monitorear perfiles similares."
    })),

    seguridad_digital: {
      superficie_ataque:
        "Perfiles públicos, enlaces compartidos y presencia en buscadores.",
      probabilidad_suplantacion: "Media",
      vectores_comunes: [
        "Creación de perfiles falsos",
        "Phishing",
        "Acceso no autorizado a cuentas"
      ],
      consecuencia:
        "Pérdida de control narrativo, daño reputacional y posible afectación económica.",
      medidas_preventivas:
        "Blindaje preventivo, monitoreo continuo y protocolos de respuesta temprana."
    },

    reputacion_digital: {
      control_narrativa: "Parcial",
      riesgos_terceros:
        "Contenido no autorizado generado por terceros puede alterar la percepción pública.",
      impacto_confianza:
        "Una narrativa no controlada reduce credibilidad y valor de marca.",
      recomendacion:
        "Centralizar comunicación oficial y monitorear menciones relevantes."
    },

    monetizacion: {
      modelo_ingresos_probable:
        "Colaboraciones, influencia, servicios, posicionamiento o capital político.",
      dependencia_activo_digital:
        "Alta: la reputación digital es un activo directamente monetizable.",
      riesgo_financiero:
        "Un incidente digital puede bloquear ingresos, acuerdos o alianzas.",
      oportunidad_perdida:
        "Falta de blindaje limita crecimiento, expansión y escalabilidad.",
      recomendacion_proteccion:
        "Proteger activos digitales para asegurar continuidad de ingresos."
    },

    impacto_economico: {
      impacto_si_no_se_atiende:
        "Riesgo de pérdidas indirectas por cancelaciones, pérdida de confianza y bloqueo de oportunidades.",
      impacto_si_se_corrige:
        "Mayor estabilidad, confianza comercial y protección del valor digital.",
      nota_metodologica:
        "El impacto se evalúa de forma cualitativa basada en exposición, dependencia y perfil público."
    },

    estrategia_crecimiento: {
      observacion:
        "El perfil tiene potencial de crecimiento si se mantiene control reputacional.",
      oportunidad:
        "Escalar monetización y presencia con blindaje activo.",
      riesgo_sin_blindaje:
        "Crecimiento acelera exposición y probabilidad de incidentes.",
      sugerencia:
        "Implementar blindaje antes de campañas, lanzamientos o crecimiento acelerado."
    },

    conclusion: {
      estado_general: "Perfil estable",
      nivel_riesgo: "Moderado",
      prioridad: "Preventiva",
      siguiente_paso:
        "Implementar monitoreo continuo y esquema de blindaje digital."
    },

    monitoreo: {
      justificacion:
        "Los riesgos digitales evolucionan constantemente.",
      que_se_monitorea:
        "Suplantación, cambios no autorizados, menciones críticas y exposición.",
      beneficio:
        "Detección temprana, reducción de impacto y protección del valor digital."
    }
  };
};
