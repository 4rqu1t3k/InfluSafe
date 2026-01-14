async function runAnalysis() {
  const payload = {
    nombre: v("nombre"),
    tipoPerfil: v("tipoPerfil"),
    pais: v("pais"),
    web: {
      principal: v("webPrincipal"),
      secundarios: v("webSecundarios")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    },
    redes: {
      instagram: v("ig"),
      facebook: v("fb"),
      x: v("x"),
      tiktok: v("tt"),
      youtube: v("yt"),
      linkedin: v("li"),
      whatsapp: v("wa")
    },
    contexto: {
      actividad: v("actividad"),
      monetizacion: v("monetizacion"),
      observaciones: v("obs")
    }
  };

  // Validación mínima (no bloqueante)
  if (!payload.nombre || !payload.tipoPerfil || !payload.pais) {
    alert("Completa Nombre, Tipo de perfil y País.");
    return;
  }

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: payload.web.principal || "https://example.com",
        tipo_analisis: payload.tipoPerfil,
        payload
      })
    });

    const data = await res.json();
    console.log("Resultado InfluSafe:", data);
    alert("Análisis enviado. Revisa la consola para ver el resultado.");

  } catch (e) {
    console.error(e);
    alert("Error al enviar el análisis.");
  }
}

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function resetForm() {
  document.querySelectorAll("input, select, textarea").forEach(el => el.value = "");
}
