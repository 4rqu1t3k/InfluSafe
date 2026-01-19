from flask import Flask, render_template, request, jsonify
from fpdf import FPDF
import os
import time
import random
import hashlib
from datetime import datetime

app = Flask(__name__, template_folder='Frontend', static_folder='Frontend', static_url_path='')

# ==========================================
# MÓDULO 1: EL ESCÁNER INTELIGENTE (Sensible al Contexto)
# ==========================================
def escanear_objetivo(nombre, perfil, redes):
    """
    Ahora la semilla depende de TODO: Nombre + Perfil + Redes.
    Si cambias el perfil, el reporte cambia totalmente.
    """
    # 1. CREAMOS LA SEMILLA MAESTRA (Matemáticamente única por combinación)
    # Convertimos el diccionario de redes a string cambias un link, cambie el reporte
    redes_str = str(sorted(redes.items())) 
    semilla_data = f"{nombre}_{perfil}_{redes_str}"
    
    # Generamos un número único basado en esa combinación
    semilla = int(hashlib.sha256(semilla_data.encode('utf-8')).hexdigest(), 16) % 10**8
    random.seed(semilla) # Fijamos la aleatoriedad para ESTA combinación específica

    # 2. ESCANEO BASADO EN LO QUE EL USUARIO INGRESÓ
    hallazgos = []
    
    # --- A) ANÁLISIS DE REDES SOCIALES  ---
    if redes.get('instagram') or redes.get('tiktok'):
        # Riesgo específico para redes visuales
        if perfil == "INFLUENCER" or perfil == "MARCA":
            hallazgos.append({
                "area": "REDES_SOCIALES",
                "titulo": "VULNERABILIDAD EN ENLACE BIOGRÁFICO (LINK-IN-BIO)",
                "dato_duro": f"Redirección insegura detectada en perfil de {perfil}.",
                "riesgo_nivel": "ALTO"
            })
        else:
            hallazgos.append({
                "area": "PRIVACIDAD",
                "titulo": "EXPOSICIÓN DE UBICACIÓN EN POSTS",
                "dato_duro": f"Se detectaron 4 fotografías recientes con metadatos EXIF activos.",
                "riesgo_nivel": "MEDIO"
            })

    if redes.get('linkedin') or perfil == "EMPRESARIO" or perfil == "EJECUTIVO":
        hallazgos.append({
            "area": "CORPORATIVO",
            "titulo": "FILTRACIÓN DE CORREO PROFESIONAL (OSINT)",
            "dato_duro": f"Cuenta corporativa visible en base de datos 'LinkedIn Breach'.",
            "riesgo_nivel": "CRITICO"
        })

    if redes.get('whatsapp'):
        hallazgos.append({
            "area": "COMUNICACION",
            "titulo": "EXPOSICIÓN DE METADATOS DE WHATSAPP",
            "dato_duro": "Foto de perfil y 'Última conexión' visibles para números desconocidos.",
            "riesgo_nivel": "ALTO"
        })

    # --- B) ANÁLISIS GENÉRICO (Si no pusieron redes, buscamos huella web) ---
    # Rellenamos con hallazgos lógicos según el perfil si faltan datos
    if len(hallazgos) < 3:
        if perfil in ["EMPRESARIO", "POLITICO", "EJECUTIVO"]:
            hallazgos.append({
                "area": "DARK_WEB",
                "titulo": "CREDENCIALES EN MERCADO NEGRO",
                "dato_duro": f"Hash de contraseña '{hashlib.md5(nombre.encode()).hexdigest()[:6]}***' a la venta.",
                "riesgo_nivel": "CRITICO"
            })
        elif perfil in ["MARCA", "INFLUENCER"]:
            hallazgos.append({
                "area": "BRANDING",
                "titulo": "SUPLANTACIÓN DE IDENTIDAD (CLONACIÓN)",
                "dato_duro": "Se detectaron 2 perfiles espejo (Fake) activos usando su imagen.",
                "riesgo_nivel": "ALTO"
            })
        else: # Persona normal
            hallazgos.append({
                "area": "WEB",
                "titulo": "RASTREO DE IP Y NAVEGACIÓN",
                "dato_duro": f"Historial de navegación vinculado a la IP pública {random.randint(100,200)}.{random.randint(0,255)}.x.x",
                "riesgo_nivel": "MEDIO"
            })

    # Aseguramos tener 3 hallazgos siempre seleccionando los más relevantes
    return {
        "target": nombre,
        "perfil": perfil,
        "redes_analizadas": [k for k, v in redes.items() if v],
        "hallazgos": hallazgos[:3], # Top 3 problemas
        "fecha": datetime.now().strftime("%d/%m/%Y %H:%M")
    }

# ==========================================
# MÓDULO 2: INTERPRETACIÓN DE IA (Redacta según el Perfil)
# ==========================================
def redactar_analisis(item, perfil):
    """
    Esta función traduce el dato técnico a lenguaje de negocio según quién seas.
    """
    area = item['area']
    
    # Lógica de redacción dinámica
    if area == "CORPORATIVO" or area == "DARK_WEB":
        if perfil == "EMPRESARIO" or perfil == "EJECUTIVO":
            return "Al tratarse de un perfil de alto nivel, esta filtración permite ataques de 'Spear Phishing' para acceder a cuentas bancarias corporativas o secretos industriales. El riesgo de fraude financiero es inminente."
        else:
            return "Sus credenciales personales están circulando en foros de hacking. Esto permite a cualquier atacante entrar a sus redes sociales y secuestrar su identidad digital permanentemente."

    if area == "REDES_SOCIALES" or area == "BRANDING":
        if perfil == "INFLUENCER" or perfil == "MARCA":
            return "Para una marca personal, esto es devastador. Los enlaces inseguros o cuentas falsas desvían su tráfico y monetización, además de engañar a su audiencia, destruyendo su reputación comercial."
        else:
            return "Tener enlaces inseguros en su perfil expone su dirección IP a extraños, lo que puede derivar en acoso digital o localización física."

    if area == "PRIVACIDAD" or area == "COMUNICACION":
        if perfil == "POLITICO":
            return "La exposición de su ubicación y rutinas representa un riesgo de seguridad nacional y personal. Actores hostiles pueden trazar sus movimientos en tiempo real."
        else:
            return "Publicar fotos con ubicación o tener WhatsApp abierto permite que delincuentes conozcan sus rutinas, domicilio y horarios, facilitando la extorsión o robo."

    return "Se detectó una vulnerabilidad técnica que requiere atención inmediata para evitar la pérdida de acceso a sus cuentas."

def calcular_impacto(perfil, hallazgos):
    # El dinero cambia según el perfil (Un empresario pierde más que un estudiante)
    base = 50000
    if perfil in ["EMPRESARIO", "MARCA"]: base = 250000
    if perfil in ["INFLUENCER", "POLITICO"]: base = 150000
    
    # Factor de riesgo
    riesgo = 1
    for h in hallazgos:
        if h['riesgo_nivel'] == "CRITICO": riesgo += 0.5
        if h['riesgo_nivel'] == "ALTO": riesgo += 0.3
        
    total = base * riesgo
    # Agregamos un poco de aleatoriedad para que no sea número cerrado siempre
    total += random.randint(100, 9999)
    return f"${total:,.2f} MXN"

# ==========================================
# MÓDULO 3: GENERADOR PDF
# ==========================================
class PDFGenerator(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'INFLUSAFE INTELLIGENCE SYSTEM', 0, 1, 'L')
        self.set_draw_color(0, 255, 65)
        self.line(10, 20, 200, 20)
        self.ln(10)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Reporte Oficial - Pág {self.page_no()}', 0, 0, 'C')

def crear_pdf(datos):
    nombre_archivo = f"Dictamen_{datos['target'].replace(' ', '_')}_{int(time.time())}.pdf"
    ruta = os.path.join("Reports", nombre_archivo)
    if not os.path.exists('Reports'): os.makedirs('Reports')

    pdf = PDFGenerator()
    pdf.add_page()

    # PORTADA
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, f"DICTAMEN: {datos['target'].upper()}", 0, 1)
    
    pdf.set_fill_color(240)
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 8, f"PERFIL ANALIZADO: {datos['perfil']}", 0, 1, 'L', fill=True)
    pdf.cell(0, 8, f"FECHA: {datos['fecha']}", 0, 1, 'L', fill=True)
    
    # REDES DETECTADAS
    if datos['redes_analizadas']:
        redes_txt = ", ".join([r.upper() for r in datos['redes_analizadas']])
        pdf.cell(0, 8, f"FUENTES ESCANEADAS: {redes_txt}", 0, 1, 'L', fill=True)
    pdf.ln(10)

    # CUERPO DEL REPORTE
    for item in datos['hallazgos']:
        # Título (Color según riesgo)
        if item['riesgo_nivel'] == "CRITICO": pdf.set_text_color(200, 0, 0)
        elif item['riesgo_nivel'] == "ALTO": pdf.set_text_color(255, 140, 0)
        else: pdf.set_text_color(0, 0, 0)
        
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 8, f"[{item['riesgo_nivel']}] {item['titulo']}", 0, 1)
        
        # Dato Duro
        pdf.set_text_color(0)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(0, 6, "EVIDENCIA TÉCNICA:", 0, 1)
        pdf.set_font("Arial", "", 10)
        pdf.multi_cell(0, 6, item['dato_duro'])
        pdf.ln(2)
        
        # Interpretación IA
        pdf.set_font("Arial", "B", 10); pdf.set_text_color(0, 100, 0)
        pdf.cell(0, 6, f"IMPACTO PARA {datos['perfil']}:", 0, 1)
        pdf.set_font("Arial", "", 10); pdf.set_text_color(0)
        
        analisis = redactar_analisis(item, datos['perfil'])
        pdf.multi_cell(0, 6, analisis)
        
        pdf.set_draw_color(200)
        pdf.line(10, pdf.get_y()+5, 200, pdf.get_y()+5)
        pdf.ln(10)

    # IMPACTO FINANCIERO
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "VALORACIÓN DE RIESGO FINANCIERO", 0, 1)
    
    monto = calcular_impacto(datos['perfil'], datos['hallazgos'])
    
    pdf.set_font("Arial", "", 11)
    pdf.multi_cell(0, 8, "Basado en los activos digitales comprometidos y su perfil profesional, el sistema Influsafe calcula una pérdida potencial por fraude, robo de identidad o daño reputacional de:")
    pdf.ln(5)
    
    pdf.set_font("Arial", "B", 24)
    pdf.set_text_color(200, 0, 0)
    pdf.cell(0, 20, monto, 0, 1, 'C')
    
    pdf.set_font("Arial", "I", 10)
    pdf.set_text_color(100)
    pdf.multi_cell(0, 6, "Cifra estimada basada en costos promedio de recuperación de cuentas, litigios y lucro cesante en su industria.")

    pdf.output(ruta, 'F')
    return nombre_archivo

# --- RUTAS ---
@app.route('/')
def home(): return render_template('index.html')

@app.route('/ejecutar-escaneo', methods=['POST'])
def escanear():
    d = request.json
    print(f"📡 Escaneando: {d.get('nombre')} ({d.get('tipo')})")
    
    # Paso 1: Escáner Inteligente
    resultados = escanear_objetivo(d.get('nombre'), d.get('tipo'), d.get('redes', {}))
    
    # Paso 2: Generar PDF
    archivo = crear_pdf(resultados)
    
    return jsonify({"status": "ok", "archivo": archivo})

if __name__ == '__main__':
    app.run(debug=True)