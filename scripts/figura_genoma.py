# Genera public/figuras/genoma_tocv.svg a escala a partir de la anotación de GenBank (NC_007340, NC_007341).
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/figuras/genoma_tocv.svg"
W, X0, X1 = 960, 110, 915
MAXNT = 8595
px = lambda nt: X0 + (X1 - X0) * nt / MAXNT
# (inicio, fin, etiqueta, descripción, color, fila)
AZUL, AMBAR, VERDE, TEAL, GRIS = '#3b5b8c', '#d9a53a', '#3f9a73', '#2a9db3', '#8a94a6'
RNA1 = dict(acc='NC_007340.1', nombre='ARN1', nt=8595, orfs=[
    (303, 6140, 'ORF1a', '· poliproteína 1a (Pro · MTR · HEL)', AZUL, 0),
    (6142, 7656, 'ORF1b', '· RdRp', AZUL, 1),
    (7663, 8244, 'P22', '', AMBAR, 0),
    (8264, 8419, 'P5', '', GRIS, 1),
])
RNA2 = dict(acc='NC_007341.1', nombre='ARN2', nt=8247, orfs=[
    (239, 340, 'P4', '', GRIS, 1),
    (733, 2397, 'HSP70h', '', VERDE, 0),
    (2407, 2610, 'P8', '', GRIS, 1),
    (2562, 4115, 'P59', '', VERDE, 0),
    (4097, 4333, 'P9', '', GRIS, 1),
    (4333, 5106, 'CP', '', TEAL, 0),
    (5112, 7121, 'CPm', '', TEAL, 1),
    (7125, 7823, 'P27', '', AMBAR, 0),
    (7832, 8029, 'P7', '', GRIS, 1),
])
F = "font-family=\"Inter, Helvetica, Arial, sans-serif\""
out = []
def t(x, y, s, size=11, anchor='start', fill='#1f2937', weight='400', style='normal', extra=''):
    out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" fill="{fill}" font-weight="{weight}" font-style="{style}" {F} {extra}>{s}</text>')

def segmento(d, y):
    # eje
    out.append(f'<line x1="{X0}" y1="{y}" x2="{px(d["nt"]):.1f}" y2="{y}" stroke="#374151" stroke-width="2.2" stroke-linecap="round"/>')
    t(X0 - 10, y + 4, "5′", 11, 'end', '#374151', '600')
    t(px(d['nt']) + 8, y + 4, "3′", 11, 'start', '#374151', '600')
    # escala cada 1000 nt
    for k in range(0, d['nt'] + 1, 1000):
        x = px(k)
        out.append(f'<line x1="{x:.1f}" y1="{y - 4}" x2="{x:.1f}" y2="{y + 4}" stroke="#6b7280" stroke-width="1"/>')
        t(x, y + 17, f'{k // 1000} kb' if k else '0', 8.5, 'middle', '#6b7280')
    t(X0 - 40, y - 26, d['nombre'], 15, 'end', '#111827', '700')
    t(X0 - 40, y - 10, f'{d["nt"]:,} nt'.replace(',', '.'), 10, 'end', '#6b7280')
    t(X0 - 40, y + 5, d['acc'], 9, 'end', '#6b7280')
    # ORFs: fila 0 arriba del eje, fila 1 más arriba todavía (apilado) para ver solapamientos
    H = 20
    for (a, b, lab, desc, col, fila) in d['orfs']:
        xa, xb = px(a), px(b)
        yy = y - 12 - H - (fila * (H + 6))
        out.append(f'<rect x="{xa:.1f}" y="{yy:.1f}" width="{max(xb - xa, 2):.1f}" height="{H}" rx="3" fill="{col}" stroke="#ffffff" stroke-width="1"/>')
        ancho = xb - xa
        texto = lab + (f'  {desc}' if desc else '')
        if ancho > 7 * len(texto):
            t((xa + xb) / 2, yy + 14, texto, 10.5, 'middle', '#ffffff', '600')
        elif ancho > 6.2 * len(lab):
            t((xa + xb) / 2, yy + 14, lab, 10, 'middle', '#ffffff', '600')
        else:
            # etiqueta por encima con guía
            ytop = yy - 8
            out.append(f'<line x1="{(xa + xb) / 2:.1f}" y1="{yy:.1f}" x2="{(xa + xb) / 2:.1f}" y2="{ytop + 2:.1f}" stroke="#9ca3af" stroke-width="0.8"/>')
            t((xa + xb) / 2, ytop, lab, 9.5, 'middle', '#374151', '600')
        if desc and ancho <= 7 * len(texto) and ancho > 6.2 * len(lab):
            t((xa + xb) / 2, yy - 6, desc, 9, 'middle', '#374151')

# ---- lienzo ----
out.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 410" width="{W}" height="410" role="img" aria-labelledby="tg td">')
out.append('<title id="tg">Organización genómica del Crinivirus tomatichlorosis (ToCV)</title>')
out.append('<desc id="td">ARN1 (8595 nt) y ARN2 (8247 nt) dibujados a escala con los marcos de lectura abiertos anotados en GenBank NC_007340 y NC_007341.</desc>')
out.append(f'<rect width="{W}" height="410" fill="#ffffff"/>')
t(24, 34, 'Organización genómica del ', 15, 'start', '#111827', '700')
out.append(f'<text x="24" y="34" font-size="15" fill="#111827" font-weight="700" {F}><tspan opacity="0">Organización genómica del </tspan><tspan font-style="italic">Crinivirus tomatichlorosis</tspan> (ToCV)</text>')
t(24, 52, 'Genoma bipartito de ARN monocatenario de sentido positivo; cada segmento se encapsida en un virión filamentoso flexuoso de 800–850 nm.', 10.5, 'start', '#4b5563')
segmento(RNA1, 150)
segmento(RNA2, 290)
# frameshift +1
x = px(6141)
out.append(f'<path d="M{x - 2:.1f} {150 - 12 - 20 - 26} l0 -12 l6 0" fill="none" stroke="#111827" stroke-width="1"/>')
t(x + 8, 150 - 12 - 20 - 34, '+1 desplazamiento ribosómico', 9, 'start', '#374151')
# leyenda
items = [(AZUL, 'Replicación: ORF1a (proteasa, metiltransferasa, helicasa) y ORF1b (RdRp)'), (AMBAR, 'Supresor del silenciamiento P22; P27'), (VERDE, 'Movimiento: HSP70h, P59'), (TEAL, 'Cápsides: principal (CP) y menor (CPm)'), (GRIS, 'Proteínas pequeñas: P4, P5, P7, P8, P9')]
posiciones = [(24, 348), (470, 348), (700, 348), (24, 366), (300, 366)]
for (col, lab), (x, ly) in zip(items, posiciones):
    out.append(f'<rect x="{x}" y="{ly - 9}" width="12" height="12" rx="2" fill="{col}"/>')
    t(x + 17, ly + 1, lab, 9.5, 'start', '#374151')
t(24, 386, 'Figura original, a escala, a partir de las secuencias de referencia GenBank NC_007340.1 (ARN1) y NC_007341.1 (ARN2), aislado Florida (Wintermantel et al. 2005, Arch Virol 150:2287–2298).', 8.5, 'start', '#6b7280')
t(24, 397, 'Nombres de los ORF y de sus productos según la anotación de GenBank; la revisión de Fiallo-Olivé y Navas-Castillo (2019) denomina P6 al último ORF del ARN1.', 8.5, 'start', '#6b7280')
out.append('</svg>')
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print('ok', OUT)
