#!/usr/bin/env python3
"""Convierte la red GEXF (NetworkX) de datos/ a un JSON compacto para el visor web.

Uso:  python3 scripts/build_network_data.py

Entrada : datos/ToCV_rep1000_6km_whiteflies_and_tomato_centrality_louvain.gexf
          scripts/dane_centroides_mgn2023.json  (centroides oficiales DANE, MGN 2023)
Salida  : public/data/red_tocv.json
          public/data/ToCV_red_municipios.gexf (copia del original para descarga)

Formato de public/data/red_tocv.json:
  {
    "meta": {...},
    "nodes": [[codigoDANE, municipio, departamento, latDANE, lonDANE, latGEXF, lonGEXF,
               pAdd, cBtab, cTvap, sBtab, sTvap, tvapDominante, invernadero_ha, campo_ha,
               tomate(0-3), betweenness, pagerank, louvain, bucle], ...],
    "edges": {"source": [idx...], "target": [idx...], "weight": [w...]}   # sin bucles, ordenadas por peso desc.
  }
Las posiciones del GEXF (x, y en km sobre una malla equirectangular) se convierten a lat/lon con un
ajuste lineal frente a los centroides DANE; corresponden aparentemente a las cabeceras municipales.
"""
import json, math, os, shutil, collections
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'datos', 'ToCV_rep1000_6km_whiteflies_and_tomato_centrality_louvain.gexf')
DANE = os.path.join(ROOT, 'scripts', 'dane_centroides_mgn2023.json')
OUT_DIR = os.path.join(ROOT, 'public', 'data')
OUT = os.path.join(OUT_DIR, 'red_tocv.json')
NS = '{http://www.gexf.net/1.2draft}'
VIZ = '{http://www.gexf.net/1.2draft/viz}'


def titulo(s):
    """'SAN JOSÉ DEL GUAVIARE' -> 'San José del Guaviare'; conserva 'D.C.'."""
    s = s.replace('_', ' ').lower()
    menores = {'de', 'del', 'la', 'las', 'los', 'el', 'y', 'e'}
    partes = []
    for i, w in enumerate(s.split()):
        if w.strip(',') == 'd.c.':
            partes.append('D.C.' + (',' if w.endswith(',') else ''))
        else:
            partes.append(w if (w in menores and i > 0) else w[:1].upper() + w[1:])
    return ' '.join(partes)


def fit(xs, ys):
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    a = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    return a, my - a * mx


def hav(la1, lo1, la2, lo2):
    R = 6371.0; p = math.pi / 180
    dlat = (la2 - la1) * p; dlon = (lo2 - lo1) * p
    h = math.sin(dlat / 2) ** 2 + math.cos(la1 * p) * math.cos(la2 * p) * math.sin(dlon / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    dane = {m['c']: m for m in json.load(open(DANE, encoding='utf-8'))['municipios']}

    graph = ET.parse(SRC).getroot().find(NS + 'graph')
    attrs = {a.get('id'): a.get('title') for a in graph.iter(NS + 'attribute')}
    raw = []
    for n in graph.find(NS + 'nodes'):
        a = {attrs[av.get('for')]: av.get('value') for av in n.iter(NS + 'attvalue')}
        p = n.find(VIZ + 'position')
        a['id'] = n.get('id').zfill(5); a['x'] = float(p.get('x')); a['y'] = float(p.get('y'))
        raw.append(a)

    # Ajuste lineal posiciones GEXF -> lat/lon usando los centroides DANE
    con = [a for a in raw if a['id'] in dane]
    ax, bx = fit([a['x'] for a in con], [dane[a['id']]['lon'] for a in con])
    ay, by = fit([a['y'] for a in con], [dane[a['id']]['lat'] for a in con])

    index = {}
    nodes = []
    sin_dane = []
    discrepancias = []
    bucles = {}
    for a in raw:
        lon_g = round(ax * a['x'] + bx, 5); lat_g = round(ay * a['y'] + by, 5)
        d = dane.get(a['id'])
        if d:
            lat, lon = d['lat'], d['lon']
            km = hav(lat, lon, lat_g, lon_g)
            if km > 15:
                discrepancias.append((round(km, 1), a['id'], titulo(d['m']), titulo(d['d'])))
        else:
            lat, lon = lat_g, lon_g
            sin_dane.append(a['id'])
        index[a['id']] = len(nodes)
        f = lambda k, nd=4: float('%.{}g'.format(nd) % float(a[k]))
        # nombres oficiales DANE (con tildes) cuando existen; si no, los del GEXF
        nombre_m = titulo(d['m']) if d else titulo(a['Municipality'])
        nombre_d = titulo(d['d']) if d else titulo(a['Province'])
        nodes.append([
            a['id'], nombre_m, nombre_d,
            lat, lon, lat_g, lon_g,
            f('pAdd'), f('cBtab'), f('cTvap'), f('sBtab'), f('sTvap'), int(a['Tvap_dominant']),
            float(a['greenhouse']), float(a['openfield']), int(float(a['tomato_cultivation'])),
            f('betweenness'), f('pagerank'), int(a['louvain_community']), 0,
        ])

    edges = []
    for e in graph.find(NS + 'edges'):
        s, t = e.get('source').zfill(5), e.get('target').zfill(5)
        w = float(e.get('weight', 1))
        if s == t:
            bucles[s] = w
            continue
        edges.append((index[s], index[t], w))
    for nid, w in bucles.items():
        nodes[index[nid]][19] = int(w)
    edges.sort(key=lambda e: -e[2])
    ws = [e[2] for e in edges]
    q = lambda fr: ws[min(len(ws) - 1, int(fr * len(ws)))]

    # Comprobaciones de hipótesis sobre los atributos del vector (se imprimen, no se publican)
    chk_padd = max(abs(float(a['pAdd']) - float(a['cBtab']) - float(a['cTvap'])) for a in raw)
    suma1 = sum(1 for a in raw if abs(float(a['sBtab']) + float(a['sTvap']) - 1) <= 1e-3)
    tv05 = sum(1 for a in raw if (a['Tvap_dominant'] == '1') == (float(a['sTvap']) > 0.5))
    tvcmp = sum(1 for a in raw if (a['Tvap_dominant'] == '1') == (float(a['sTvap']) > float(a['sBtab'])))
    print(f'pAdd == cBtab + cTvap: error máximo {chk_padd:.1e}')
    print(f'sBtab + sTvap == 1 en {suma1}/{len(raw)} nodos')
    print(f'Tvap_dominant == (sTvap > 0,5): {tv05}/{len(raw)} ; == (sTvap > sBtab): {tvcmp}/{len(raw)}')

    deps = sorted({n[2] for n in nodes})
    data = {
        'meta': {
            'fuente': os.path.basename(SRC),
            'generado': '2026-10-19',
            'nodos': len(nodes), 'aristas': len(edges), 'bucles': len(bucles),
            'departamentos': deps,
            'comunidades': sorted({n[18] for n in nodes}),
            'peso_cuantiles': {'min': ws[-1], 'p50': q(0.5), 'p75': q(0.25), 'p90': q(0.10), 'p99': q(0.01), 'max': ws[0]},
            'ajuste_posiciones': {'lon': [ax, bx], 'lat': [ay, by]},
            'centroides': 'DANE MGN 2023 (MGN_ADM_MPIO_GRAFICO), centroide ponderado por área',
            'sin_centroide_dane': sin_dane,
            'columnas': ['codigo', 'municipio', 'departamento', 'lat', 'lon', 'latGexf', 'lonGexf', 'pAdd', 'cBtab', 'cTvap',
                         'sBtab', 'sTvap', 'tvapDominante', 'invernaderoHa', 'campoHa', 'tomate', 'betweenness', 'pagerank', 'louvain', 'bucle'],
        },
        'nodes': nodes,
        'edges': {
            'source': [e[0] for e in edges],
            'target': [e[1] for e in edges],
            'weight': [int(e[2]) if float(e[2]).is_integer() else e[2] for e in edges],
        },
    }
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))
    shutil.copyfile(SRC, os.path.join(OUT_DIR, 'ToCV_red_municipios.gexf'))
    print(f'{len(nodes)} nodos, {len(edges)} aristas, {len(bucles)} bucles -> {OUT} ({os.path.getsize(OUT)/1024:.0f} KB)')
    print(f'ajuste: lon = {ax:.6f}·x + {bx:.4f} ; lat = {ay:.6f}·y + {by:.4f}')
    print(f'municipios sin centroide DANE: {len(sin_dane)}')
    discrepancias.sort(reverse=True)
    print(f'municipios con posición GEXF a más de 15 km del centroide DANE: {len(discrepancias)}')
    with open(os.path.join(ROOT, 'docs', 'centroides_discrepancias_mayores_15km.md'), 'w', encoding='utf-8') as fh:
        fh.write('# Municipios cuya posición en el GEXF difiere >15 km del centroide DANE (MGN 2023)\n\n')
        fh.write('La posición del GEXF (convertida a lat/lon por ajuste lineal) coincide con la cabecera municipal, no con el centroide del polígono; '
                 'por eso las mayores diferencias son municipios extensos de la Amazonía, Orinoquía, Pacífico y La Guajira.\n\n')
        fh.write('| km | Código DANE | Municipio | Departamento |\n|---|---|---|---|\n')
        for km, c, m, dpt in discrepancias:
            fh.write(f'| {km} | {c} | {m} | {dpt} |\n')
    print('detalle -> docs/centroides_discrepancias_mayores_15km.md')


if __name__ == '__main__':
    main()
