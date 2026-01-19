document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const panelInput = document.getElementById('input-area');
    const containerGlobo = document.getElementById('container-globo');
    const containerLogos = document.getElementById('container-logos');
    const containerFinal = document.getElementById('container-mensaje-final');
    const txtLocalizando = document.getElementById('text-localizando');

    btnIniciar.addEventListener('click', async () => {
        // 1. RECOLECTAR DATOS (Usando los IDs de tu HTML)
        const datos = {
            nombre: document.getElementById('nombre').value,
            perfil: document.getElementById('tipo-perfil').value,
            redes: {
                web: document.getElementById('red-web').value,
                whatsapp: document.getElementById('red-whatsapp').value,
                instagram: document.getElementById('red-instagram').value,
                facebook: document.getElementById('red-facebook').value,
                linkedin: document.getElementById('red-linkedin').value,
                tiktok: document.getElementById('red-tiktok').value
            }
        };

        // 2. VALIDACIÓN
        if (!datos.nombre || !datos.perfil) {
            alert("⚠️ ERROR: Debes ingresar el Nombre y seleccionar un Perfil.");
            return;
        }

        // 3. INICIAR ANIMACIÓN (Globo)
        panelInput.style.display = 'none';
        containerGlobo.classList.remove('hidden');
        
        // Efecto de texto
        setTimeout(() => {
            txtLocalizando.innerText = `OBJETIVO: ${datos.nombre.toUpperCase()}`;
            txtLocalizando.style.color = "#00ff41";
        }, 1000);

        try {
            // 4. PETICIÓN AL CEREBRO (PYTHON)
            const respuesta = await fetch('/ejecutar-escaneo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            // Si Python falla (Error 500), leemos el mensaje de error real
            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.mensaje || "Error interno del servidor");
            }

            const resultado = await respuesta.json();

            // 5. TRANSICIÓN A LOGOS (3 Segundos)
            setTimeout(() => {
                containerGlobo.classList.add('hidden');
                containerLogos.classList.remove('hidden');

                // 6. TRANSICIÓN A FINAL (3 Segundos)
                setTimeout(() => {
                    containerLogos.classList.add('hidden');
                    containerFinal.classList.remove('hidden');
                    
                    // Mostrar nombre del archivo
                    document.querySelector('.highlight').innerText = resultado.archivo;

                }, 3000); 
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("❌ ERROR TÉCNICO:\n" + error.message + "\n\nRevisa la terminal negra de VS Code para más detalles.");
            location.reload();
        }
    });
});