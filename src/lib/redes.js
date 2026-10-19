// Carga y construcción del grafo de transmisión (public/data/red_tocv.json) y escalas de color.
import { UndirectedGraph } from 'graphology';

// Colores pensados para el mapa base oscuro (Esri World Dark Gray, ~#2b2b2b).
export const COLORES = {
  btab: '#ef8354',
  btabClaro: '#ffb08a',
  tvap: '#5ad1e6',
  tvapClaro: '#9fe6f2',
  neutro: '#efe6c9',
  amarillo: '#f2c14e',
  tomate: '#ff6a52',
  invernadero: '#f7b733',
  ambos: '#c77dff',
  sinCultivo: '#8c9bb0',
  atenuado: '#46525f',
  etiqueta: '#f3f7fb',
  anillo: '#ffffff',
};

export const COLOR_CULTIVO = {
  0: COLORES.sinCultivo,
  1: COLORES.tomate,
  2: COLORES.invernadero,
  3: COLORES.ambos,
};

export const PALETA = ['#ff6a52', '#5ad1e6', '#f7b733', '#b48cff', '#5cc496', '#ffd166', '#f15bb5', '#6fa8ff', '#d9a066', '#8ac926', '#ff8fd6', '#2ec4b6', '#ff9f68', '#7fb3e6', '#c77dff', '#ff5d8f', '#4cc9f0', '#b5e48c', '#ffb86b', '#9d8cff', '#56cfe1', '#ff7096', '#06d6a0', '#ffe066', '#a685ff', '#72ddf7', '#fb8b24', '#aab8cf', '#c084fc', '#80ed99'];

export function colorCategoria(valor, lista) {
  const i = lista.indexOf(valor);
  return PALETA[(i >= 0 ? i : 0) % PALETA.length];
}

function mezclar(a, b, f) {
  return a.map((ch, i) => Math.round(ch + (b[i] - ch) * f));
}
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const hexArgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// Escala divergente: 0 = domina B. tabaci (terracota) · 0,5 = neutro (crema) · 1 = domina T. vaporariorum (cian)
export function colorVector(sTvap) {
  const x = Math.max(0, Math.min(1, sTvap));
  const a = hexArgb(COLORES.btab); const n = hexArgb(COLORES.neutro); const b = hexArgb(COLORES.tvap);
  if (x <= 0.5) return rgb(mezclar(a, n, x / 0.5));
  return rgb(mezclar(n, b, (x - 0.5) / 0.5));
}

// Escala secuencial (azul apagado -> crema -> amarillo -> naranja) para métricas en 0..1.
// Debe coincidir con .leyenda-gradiente--metrica en RedTransmision.css.
export function colorMetrica(v) {
  const paradas = [[0, [64, 104, 140]], [0.4, [143, 216, 180]], [0.7, [242, 193, 78]], [1, [239, 110, 70]]];
  const x = Math.max(0, Math.min(1, v));
  for (let i = 1; i < paradas.length; i += 1) {
    if (x <= paradas[i][0]) {
      const [a, ca] = paradas[i - 1];
      const [b, cb] = paradas[i];
      return rgb(mezclar(ca, cb, (x - a) / (b - a)));
    }
  }
  return rgb(paradas[paradas.length - 1][1]);
}

export async function cargarRed(onProgreso) {
  const url = `${import.meta.env.BASE_URL}data/red_tocv.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !onProgreso) return res.json();
  const reader = res.body.getReader();
  const partes = [];
  let recibido = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    partes.push(value);
    recibido += value.length;
    onProgreso(total ? recibido / total : null, recibido);
  }
  return JSON.parse(await new Blob(partes).text());
}

// Construye el grafo graphology (no dirigido: las aristas recíprocas se suman) y los índices auxiliares.
export function construirGrafo(datos) {
  const graph = new UndirectedGraph();
  const col = Object.fromEntries(datos.meta.columnas.map((c, i) => [c, i]));
  const n = datos.nodes.length;
  const registros = new Array(n);

  for (let i = 0; i < n; i += 1) {
    const r0 = datos.nodes[i];
    const reg = {
      id: r0[col.codigo], mun: r0[col.municipio], dep: r0[col.departamento],
      lat: r0[col.lat], lon: r0[col.lon], latG: r0[col.latGexf], lonG: r0[col.lonGexf],
      pAdd: r0[col.pAdd], cBtab: r0[col.cBtab], cTvap: r0[col.cTvap], sBtab: r0[col.sBtab], sTvap: r0[col.sTvap],
      tvapDom: r0[col.tvapDominante] === 1,
      inv: r0[col.invernaderoHa], campo: r0[col.campoHa], tomate: r0[col.tomate],
      bc: r0[col.betweenness], pr: r0[col.pagerank], lv: r0[col.louvain], bucle: r0[col.bucle],
      grado: 0, fuerza: 0, idx: i,
    };
    reg.area = reg.inv + reg.campo;
    registros[i] = reg;
    graph.addNode(reg.id, { x: 0, y: 0, lat: reg.lat, lng: reg.lon, label: reg.mun, size: 3, color: '#8c9bb0', borderColor: '#8c9bb0', i });
  }

  const { source, target, weight } = datos.edges;
  for (let e = 0; e < source.length; e += 1) {
    const s = registros[source[e]].id;
    const t = registros[target[e]].id;
    const w = weight[e];
    if (graph.hasEdge(s, t)) {
      graph.updateEdgeAttribute(s, t, 'weight', (x) => x + w);
    } else {
      graph.addEdge(s, t, { weight: w });
      registros[source[e]].grado += 1;
      registros[target[e]].grado += 1;
    }
    registros[source[e]].fuerza += w;
    registros[target[e]].fuerza += w;
  }

  const pesos = [];
  graph.forEachEdge((edge, a) => pesos.push(a.weight));
  pesos.sort((a, b) => b - a);
  const q = (f) => pesos[Math.min(pesos.length - 1, Math.floor(f * pesos.length))];
  const cuantiles = { min: pesos[pesos.length - 1], p50: q(0.5), p75: q(0.25), p90: q(0.1), p99: q(0.01), max: pesos[0] };

  const ordenar = (clave) => registros.slice().sort((a, b) => b[clave] - a[clave]).map((r) => r.id);
  const rank = (clave) => new Map(ordenar(clave).map((id, i) => [id, i + 1]));
  const max = (clave) => Math.max(...registros.map((r) => r[clave]));

  const porId = new Map(registros.map((r) => [r.id, r]));
  const departamentos = Array.from(new Set(registros.map((r) => r.dep))).sort((a, b) => a.localeCompare(b, 'es'));
  const comunidades = Array.from(new Set(registros.map((r) => r.lv))).sort((a, b) => a - b);

  return {
    graph, registros, porId, departamentos, comunidades, pesos, cuantiles, meta: datos.meta,
    rankPr: rank('pr'), rankBc: rank('bc'), rankGrado: rank('grado'), rankArea: rank('area'),
    maxPr: max('pr'), maxBc: max('bc'), maxGrado: max('grado'), maxArea: max('area'), maxPAdd: max('pAdd'),
    tomateros: registros.filter((r) => r.tomate > 0).length,
  };
}

// Número de aristas con peso >= umbral (pesos ordenados de mayor a menor).
export function aristasSobreUmbral(pesos, umbral) {
  let lo = 0; let hi = pesos.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pesos[mid] >= umbral) lo = mid + 1; else hi = mid;
  }
  return lo;
}

export function formatoNumero(x, dec = 0) {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: dec, minimumFractionDigits: dec }).format(x);
}

export function normalizar(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
