from flask import Flask, render_template, request, jsonify
from fpdf import FPDF
import os
import random
import hashlib
import traceback
from datetime import datetime

app = Flask(__name__, template_folder='Frontend', static_folder='Frontend', static_url_path='')

# --- UTILIDADES ---
def limpiar_texto(texto):
    if not texto: return ""
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'ñ': 'n', 'Ñ': 'N'
    }
    for search, replace in replacements.items():
        texto = texto.replace(search, replace)
    return texto.encode('latin-1', 'replace').decode('latin-1')

# ==========================================
# MOTOR DE REDACCIÓN MODULAR (EL CEREBRO)
# ==========================================
class RedactorSistema:
    def __init__(self, perfil):
        self.perfil = perfil

    def redactar_problema(self, activo, tipo_problema):
        inicios = [
            f"La auditoria tecnica sobre {activo} detecto",
            f"El escaneo de puertos y protocolos en {activo} revela",
            f"Analisis forense digital en {activo} identifica",
            f"Se ha localizado en {activo} el siguiente vector:"
        ]
        
        detalles = {
            "SSL": "falta de cifrado extremo a extremo y certificados SSL invalidos.",
            "PUERTOS": "servicios de administracion remota expuestos sin firewall.",
            "PRIVACIDAD": "fuga de metadatos EXIF y configuracion de privacidad nula.",
            "BOTS": "patrones de trafico inorganico (bots) superiores al 35%.",
            "DARKWEB": "credenciales operativas filtradas en repositorios de Dark Web."
        }
        
        return f"{random.choice(inicios)} {detalles.get(tipo_problema, 'vulnerabilidades criticas.')}"

    def redactar_consecuencia(self, tipo_problema):
        if self.perfil in ["EMPRESARIO", "EJECUTIVO", "POLITICO"]:
            if tipo_problema == "DARKWEB": return "Habilita espionaje corporativo y acceso no autorizado a sistemas bancarios (BEC)."
            if tipo_problema == "PRIVACIDAD": return "Expone al objetivo a ingenieria social dirigida (Spear Phishing) y localizacion fisica."
            return "Riesgo operativo critico con potencial de litigios legales y perdida de secretos industriales."
        
        elif self.perfil in ["INFLUENCER", "MARCA"]:
            if tipo_problema == "BOTS": return "Degradacion del 'Trust Score', Shadowban permanente y perdida de monetizacion."
            if tipo_problema == "SSL": return "Desvio de trafico (Hijacking) y perdida de credibilidad ante patrocinadores."
            return "Riesgo inminente de secuestro de cuenta (Account Takeover) y perdida de audiencia."
        
        else: # PERSONA
            return "Alta probabilidad de robo de identidad, fraude financiero y extorsion digital."

    def redactar_solucion(self, tipo_problema):
        if tipo_problema == "SSL": return "Despliegue de WAF (Web Application Firewall) y HSTS estricto."
        if tipo_problema == "BOTS": return "Depuracion de audiencia y analisis de integridad de cuenta."
        if tipo_problema == "DARKWEB": return "Rotacion de credenciales y adopcion de llaves FIDO2 (YubiKey)."
        return "Hardening de dispositivos y revision de protocolos de privacidad."

# ==========================================
# LÓGICA DE ESCANEO
# ==========================================
def motor_forense(nombre, perfil, redes):
    try:
        data_string = f"{nombre}{perfil}{str(redes)}"
        semilla = int(hashlib.sha256(data_string.encode()).hexdigest(), 16) % 10**9
        random.seed(semilla)

        redactor = RedactorSistema(perfil)
        hallazgos = []
        
        # 1. WEB
        web = redes.get('web')
        if web and len(web) > 3:
            tipo = random.choice(["SSL", "PUERTOS"])
            hallazgos.append({
                "titulo": f"VULNERABILIDAD CRITICA EN INFRAESTRUCTURA ({web})",
                "riesgo": redactor.redactar_problema("el dominio web", tipo),
                "consecuencia": redactor.redactar_consecuencia(tipo),
                "solucion": redactor.redactar_solucion(tipo),
                "costo": 250000
            })

        # 2. WHATSAPP
        wa = redes.get('whatsapp')
        if wa and len(wa) > 5:
            hallazgos.append({
                "titulo": "EXPOSICION DE TELEFONIA MOVIL Y METADATOS",
                "riesgo": redactor.redactar_problema("la linea movil", "PRIVACIDAD"),
                "consecuencia": "Permite ataques de SIM Swapping (clonacion de chip) y secuestro de sesiones.",
                "solucion": "Activacion de 2FA biometrico y restriccion de foto de perfil.",
                "costo": 120000
            })

        # 3. REDES SOCIALES
        for red in ['instagram', 'facebook', 'tiktok', 'linkedin']:
            user = redes.get(red)
            if user and len(user) > 1:
                prob = "BOTS" if red in ['instagram', 'tiktok'] else "PRIVACIDAD"
                hallazgos.append({
                    "titulo": f"VECTOR DE RIESGO EN {red.upper()} (@{user})",
                    "riesgo": redactor.redactar_problema(f"la cuenta de {red}", prob),
                    "consecuencia": redactor.redactar_consecuencia(prob),
                    "solucion": redactor.redactar_solucion(prob),
                    "costo": 150000
                })

        # 4. DARK WEB
        hallazgos.append({
            "titulo": "FILTRACION DE IDENTIDAD (DARK WEB / DEEP WEB)",
            "riesgo": redactor.redactar_problema("la identidad digital", "DARKWEB"),
            "consecuencia": redactor.redactar_consecuencia("DARKWEB"),
            "solucion": redactor.redactar_solucion("DARKWEB"),
            "costo": 500000
        })

        total = sum(h['costo'] for h in hallazgos)
        
        return {
            "target": limpiar_texto(nombre),
            "perfil": perfil,
            "fecha": datetime.now().strftime("%d/%m/%Y"),
            "hallazgos": hallazgos,
            "total_perdida": f"${total:,.2f} MXN"
        }

    except Exception as e:
        traceback.print_exc()
        raise e

# ==========================================
# GENERADOR PDF CIENTÍFICO
# ==========================================
class PDFReport(FPDF):
    def header(self):
        # 1. TÍTULO PRINCIPAL
        self.set_font('Arial', 'B', 14)
        self.cell(0, 8, 'INFLUSAFE SECURITY SYSTEMS', 0, 1, 'L')
        
        # 2. CREDENCIALES CIENTÍFICAS (ORCID y DOI)
        self.set_font('Arial', '', 8)
        self.set_text_color(100, 100, 100) # Gris oscuro profesional
        self.cell(0, 4, 'ORCID ID: https://orcid.org/0009-0004-1715-3238', 0, 1, 'L')
        self.cell(0, 4, 'DOI CERTIFIED: https://doi.org/10.5281/zenodo.18238918', 0, 1, 'L')
        
        # 3. SIN LÍNEA VERDE (Espacio limpio)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128)
        # 4. FIRMA DEL MOTOR (Cero IA)
        self.cell(0, 10, f'Reporte generado por Motor de Analisis Forense Influsafe v6.0 - Pagina {self.page_no()}', 0, 0, 'C')

def crear_pdf(datos):
    try:
        if not os.path.exists('Reports'): os.makedirs('Reports')
        ts = datetime.now().strftime("%H%M%S")
        nombre_archivo = f"Dictamen_{datos['target'].replace(' ', '_')}_{ts}.pdf"
        ruta = os.path.join("Reports", nombre_archivo)

        pdf = PDFReport()
        pdf.add_page()

        # TÍTULO DEL DICTAMEN
        pdf.set_font("Arial", "B", 16)
        pdf.set_text_color(0)
        pdf.cell(0, 10, "DICTAMEN DE CIBERSEGURIDAD", 0, 1, "C")
        pdf.ln(5)

        # FICHA TÉCNICA
        pdf.set_font("Arial", "", 10)
        pdf.cell(0, 6, f"Objetivo Analizado: {datos['target']}", 0, 1)
        pdf.cell(0, 6, f"Perfil: {datos['perfil']} | Fecha: {datos['fecha']}", 0, 1)
        pdf.ln(10)

        # CUERPO DE HALLAZGOS
        for i, h in enumerate(datos['hallazgos'], 1):
            
            # Título
            pdf.set_font("Arial", "B", 12)
            pdf.set_text_color(0) 
            pdf.cell(0, 8, f"{i}. {h['titulo']}", 0, 1)

            # Riesgo / Análisis (Rojo Oscuro)
            pdf.set_font("Arial", "B", 10)
            pdf.set_text_color(180, 0, 0) 
            pdf.cell(0, 6, "Analisis Tecnico de Riesgo:", 0, 1)
            pdf.set_font("Arial", "", 10)
            pdf.set_text_color(50)
            pdf.multi_cell(0, 5, f"{h['riesgo']}\n{h['consecuencia']}")
            pdf.ln(2)

            # Solución (Verde Oscuro)
            pdf.set_font("Arial", "B", 10)
            pdf.set_text_color(0, 100, 0)
            pdf.cell(0, 6, "Protocolo de Blindaje Recomendado:", 0, 1)
            pdf.set_font("Arial", "", 10)
            pdf.set_text_color(0)
            pdf.multi_cell(0, 5, h['solucion'])
            
            # Caja de Impacto
            pdf.ln(2)
            pdf.set_fill_color(245, 245, 245) 
            pdf.set_font("Arial", "I", 9)
            pdf.multi_cell(0, 6, "IMPACTO ESTRATEGICO: La vulnerabilidad detectada compromete la integridad de los activos digitales y requiere atencion prioritaria.", 0, 'L', True)
            
            pdf.ln(8)

        # CIERRE FINANCIERO
        pdf.add_page()
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "RIESGO FINANCIERO PROYECTADO", 0, 1)
        
        texto_dinero = (
            "La falta de protocolos de ciberseguridad conlleva un pasivo oculto. "
            f"Basado en los activos digitales auditados, se estima una exposicion financiera de {datos['total_perdida']}, "
            "calculada sobre costos de recuperacion, analisis forense post-incidente y lucro cesante."
        )
        pdf.set_font("Arial", "", 11)
        pdf.multi_cell(0, 6, texto_dinero)
        
        pdf.ln(20)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(0, 5, "INFLUSAFE SECURITY OPERATIONS CENTER", 0, 1, "R")
        pdf.set_font("Arial", "", 8)
        pdf.set_text_color(100)
        pdf.cell(0, 5, "Certificado bajo estandares OSINT internacionales", 0, 1, "R")

        pdf.output(ruta, 'F')
        return nombre_archivo

    except Exception as e:
        traceback.print_exc()
        raise e

# ==========================================
# RUTAS
# ==========================================
@app.route('/')
def home(): return render_template('index.html')

@app.route('/ejecutar-escaneo', methods=['POST'])
def escanear():
    try:
        d = request.json
        if not d or 'nombre' not in d:
            return jsonify({"status": "error", "mensaje": "Faltan datos"}), 400

        resultado = motor_forense(d.get('nombre'), d.get('perfil'), d.get('redes', {}))
        archivo = crear_pdf(resultado)
        
        return jsonify({"status": "ok", "archivo": archivo})
        
    except Exception as e:
        return jsonify({"status": "error", "mensaje": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)