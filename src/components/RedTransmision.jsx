import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sigma from 'sigma';
import { createNodeBorderProgram } from '@sigma/node-border';
import bindLeafletLayer from '@sigma/layer-leaflet';
import T from '../lib/cientifico.jsx';
import { TILES } from './MapaDistribucion.jsx';
import {
  cargarRed, construirGrafo, aristasSobreUmbral, formatoNumero, normalizar,
  colorVector, colorMetrica, colorCategoria, COLOR_CULTIVO, COLORES,
} from '../lib/redes.js';
import './RedTransmision.css';

const COLOR_ARISTA_ACTIVA = 'rgba(255, 217, 138, 0.95)';
const FILTROS_INICIALES = { dep: '', vector: 'todos', cultivo: { 0: true, 1: true, 2: true, 3: true }, comunidad: '' };

// Programa de nodos con borde: el anillo blanco marca los municipios con cultivo de tomate.
const NodoConBorde = createNodeBorderProgram({
  borders: [
    { size: { value: 0.18 }, color: { attribute: 'borderColor' } },
    { size: { fill: true }, color: { attribute: 'color' } },
  ],
});

// Etiqueta al pasar el cursor: caja oscura con texto claro.
function dibujarHover(context, data, settings) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  context.font = `${weight} ${size}px ${font}`;
  const texto = data.label || '';
  const ancho = context.measureText(texto).width + 16;
  const x = Math.round(data.x + data.size + 6);
  const y = Math.round(data.y - size / 2 - 6);
  context.fillStyle = 'rgba(11, 21, 34, 0.94)';
  context.strokeStyle = 'rgba(159, 177, 201, 0.5)';
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(x, y, ancho, size + 12, 6);
  context.fill();
  context.stroke();
  context.fillStyle = COLORES.etiqueta;
  context.fillText(texto, x + 8, y + size + 2);
  // halo del nodo
  context.beginPath();
  context.arc(data.x, data.y, data.size + 3, 0, Math.PI * 2);
  context.strokeStyle = 'rgba(255,255,255,0.8)';
  context.lineWidth = 1.5;
  context.stroke();
}

function Icono({ tipo }) {
  if (tipo === 'mas') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
  if (tipo === 'menos') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>;
  if (tipo === 'centrar') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>;
  return null;
}

function RedTransmision({ t }) {
  const r = t.red;
  const ui = r.ui;
  const atr = r.atributos;

  const [modelo, setModelo] = useState(null);
  const [carga, setCarga] = useState({ activo: true, progreso: null });
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [colorPor, setColorPor] = useState('vector');
  const [tamanoPor, setTamanoPor] = useState('area');
  const [posicion, setPosicion] = useState('dane');
  const [umbral, setUmbral] = useState(1);
  const [mostrarAristas, setMostrarAristas] = useState(true);
  const [seleccion, setSeleccion] = useState(null);
  const [hover, setHover] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [listaAbierta, setListaAbierta] = useState(false);

  const contenedorRef = useRef(null);
  const sigmaRef = useRef(null);
  const capaRef = useRef(null);
  const estadoRef = useRef({});

  // ---- carga de datos ----
  useEffect(() => {
    let cancelado = false;
    cargarRed((p) => { if (!cancelado) setCarga({ activo: true, progreso: p }); })
      .then((datos) => {
        if (cancelado) return;
        const m = construirGrafo(datos);
        setModelo(m);
        setUmbral(m.cuantiles.p50);
        setCarga({ activo: false, progreso: 1 });
      })
      .catch((e) => { if (!cancelado) { console.error(e); setError(String(e.message || e)); setCarga({ activo: false }); } });
    return () => { cancelado = true; };
  }, []);

  // ---- conjunto visible según filtros ----
  const conjuntoVisible = useMemo(() => {
    if (!modelo) return null;
    const f = filtros;
    const todoCultivo = f.cultivo[0] && f.cultivo[1] && f.cultivo[2] && f.cultivo[3];
    if (!f.dep && f.vector === 'todos' && todoCultivo && f.comunidad === '') return null;
    const set = new Set();
    modelo.registros.forEach((x) => {
      if (f.dep && x.dep !== f.dep) return;
      if (f.vector === 'btab' && x.tvapDom) return;
      if (f.vector === 'tvap' && !x.tvapDom) return;
      if (!f.cultivo[x.tomate]) return;
      if (f.comunidad !== '' && x.lv !== Number(f.comunidad)) return;
      set.add(x.id);
    });
    return set;
  }, [modelo, filtros]);

  const vecinosSeleccion = useMemo(() => {
    if (!modelo || !seleccion || !modelo.graph.hasNode(seleccion)) return null;
    return new Set(modelo.graph.neighbors(seleccion));
  }, [modelo, seleccion]);

  const visibles = modelo ? (conjuntoVisible ? conjuntoVisible.size : modelo.registros.length) : 0;

  const colorNodo = useCallback((x) => {
    if (!modelo) return '#999';
    switch (colorPor) {
      case 'indice': return colorMetrica(x.pAdd / (modelo.maxPAdd || 1));
      case 'cultivo': return COLOR_CULTIVO[x.tomate];
      case 'comunidad': return colorCategoria(x.lv, modelo.comunidades);
      case 'departamento': return colorCategoria(x.dep, modelo.departamentos);
      case 'betweenness': return colorMetrica(Math.sqrt(x.bc / (modelo.maxBc || 1)));
      case 'pagerank': return colorMetrica(x.pr / (modelo.maxPr || 1));
      default: return colorVector(x.sTvap);
    }
  }, [modelo, colorPor]);

  const tamanoNodo = useCallback((x) => {
    if (!modelo) return 3;
    const base = 2.6; const extra = 11;
    switch (tamanoPor) {
      case 'pagerank': return base + extra * Math.sqrt(x.pr / (modelo.maxPr || 1));
      case 'betweenness': return base + extra * Math.sqrt(x.bc / (modelo.maxBc || 1));
      case 'grado': return base + extra * Math.sqrt(x.grado / (modelo.maxGrado || 1));
      case 'uniforme': return base + 1.6;
      default: return base + 0.8 + extra * Math.sqrt(x.area / (modelo.maxArea || 1));
    }
  }, [modelo, tamanoPor]);

  estadoRef.current = { modelo, conjuntoVisible, seleccion, vecinosSeleccion, colorNodo, tamanoNodo, umbral, mostrarAristas };

  // ---- instancia de sigma + capa Leaflet ----
  useEffect(() => {
    if (!modelo || !contenedorRef.current) return undefined;
    const { graph } = modelo;
    const modeloLocal = modelo;
    const logMax = Math.log(modelo.cuantiles.max + 1);

    const renderer = new Sigma(graph, contenedorRef.current, {
      allowInvalidContainer: true,
      renderLabels: true,
      labelFont: 'Inter, sans-serif',
      labelSize: 12,
      labelWeight: '600',
      labelColor: { color: COLORES.etiqueta },
      defaultDrawNodeHover: dibujarHover,
      labelRenderedSizeThreshold: 7,
      labelDensity: 0.12,
      labelGridCellSize: 110,
      hideEdgesOnMove: true,
      hideLabelsOnMove: true,
      zIndex: true,
      nodeProgramClasses: { borde: NodoConBorde },
      defaultNodeType: 'borde',
      nodeReducer: (node, data) => {
        const st = estadoRef.current;
        const x = modeloLocal.porId.get(node);
        if (!x) return data;
        const color = st.colorNodo(x);
        const res = { ...data, size: st.tamanoNodo(x), color, borderColor: x.tomate > 0 ? COLORES.anillo : color, zIndex: 1 };
        if (st.conjuntoVisible && !st.conjuntoVisible.has(node)) { res.hidden = true; return res; }
        if (st.seleccion) {
          if (node === st.seleccion) { res.zIndex = 3; res.size = res.size * 1.4 + 2; res.forceLabel = true; res.highlighted = true; }
          else if (st.vecinosSeleccion && st.vecinosSeleccion.has(node)) { res.zIndex = 2; res.forceLabel = res.size > 5; }
          else { res.color = COLORES.atenuado; res.borderColor = COLORES.atenuado; res.zIndex = 0; res.label = ''; }
        }
        return res;
      },
      edgeReducer: (edge, data) => {
        const st = estadoRef.current;
        const res = { ...data };
        if (!st.mostrarAristas || data.weight < st.umbral) { res.hidden = true; return res; }
        const [s, tg] = modeloLocal.graph.extremities(edge);
        if (st.conjuntoVisible && (!st.conjuntoVisible.has(s) || !st.conjuntoVisible.has(tg))) { res.hidden = true; return res; }
        const w = Math.log(data.weight + 1) / logMax;
        res.size = 0.4 + 2.2 * w;
        if (st.seleccion) {
          if (s === st.seleccion || tg === st.seleccion) { res.color = COLOR_ARISTA_ACTIVA; res.size = 1 + 3 * w; res.zIndex = 2; }
          else { res.color = 'rgba(242, 193, 78, 0.04)'; res.zIndex = 0; }
        } else {
          res.color = `rgba(242, 193, 78, ${0.1 + 0.45 * w})`;
        }
        return res;
      },
    });

    const capa = bindLeafletLayer(renderer, {
      tileLayer: { urlTemplate: TILES.url, attribution: TILES.attribution },
      getNodeLatLng: (a) => ({ lat: a.lat, lng: a.lng }),
    });

    renderer.on('enterNode', ({ node }) => setHover(node));
    renderer.on('leaveNode', () => setHover(null));
    renderer.on('clickNode', ({ node }) => setSeleccion((s) => (s === node ? null : node)));
    renderer.on('clickStage', () => setSeleccion(null));

    sigmaRef.current = renderer;
    capaRef.current = capa;
    window.__sigma = renderer; // útil para depurar y para las pruebas automáticas
    window.__capa = capa;
    return () => {
      sigmaRef.current = null;
      try { capa.clean(); } catch (e) { /* la capa ya fue destruida */ }
      renderer.kill();
      capaRef.current = null;
    };
  }, [modelo]);

  // Cambio de posición de los nodos (centroide DANE vs posición original del GEXF)
  useEffect(() => {
    if (!modelo || !capaRef.current) return;
    modelo.graph.updateEachNodeAttributes((id, a) => {
      const x = modelo.porId.get(id);
      return posicion === 'dane' ? { ...a, lat: x.lat, lng: x.lon } : { ...a, lat: x.latG, lng: x.lonG };
    });
    capaRef.current.updateGraphCoordinates(modelo.graph);
    if (sigmaRef.current) sigmaRef.current.refresh();
  }, [modelo, posicion]);

  // Vuelve a aplicar los reducers cuando cambia el estado visual.
  useEffect(() => {
    if (sigmaRef.current && modelo) sigmaRef.current.refresh({ skipIndexation: true });
  }, [modelo, conjuntoVisible, seleccion, vecinosSeleccion, colorNodo, tamanoNodo, umbral, mostrarAristas]);

  // ---- cámara ----
  const acercar = () => sigmaRef.current && sigmaRef.current.getCamera().animatedZoom({ duration: 300 });
  const alejar = () => sigmaRef.current && sigmaRef.current.getCamera().animatedUnzoom({ duration: 300 });
  const recentrar = () => sigmaRef.current && sigmaRef.current.getCamera().animatedReset({ duration: 500 });

  const enfocarNodo = useCallback((id, ratio = 0.3) => {
    const s = sigmaRef.current;
    if (!s) return;
    const d = s.getNodeDisplayData(id);
    if (!d) return;
    s.getCamera().animate({ x: d.x, y: d.y, ratio }, { duration: 600 });
  }, []);

  // ---- búsqueda ----
  const resultadosBusqueda = useMemo(() => {
    if (!modelo || busqueda.trim().length < 2) return [];
    const qn = normalizar(busqueda.trim());
    const out = [];
    for (const x of modelo.registros) {
      if (normalizar(x.mun).includes(qn) || x.id === qn) out.push(x);
      if (out.length >= 12) break;
    }
    return out.sort((a, b) => normalizar(a.mun).indexOf(qn) - normalizar(b.mun).indexOf(qn) || b.area - a.area);
  }, [modelo, busqueda]);

  const elegirResultado = (x) => {
    setListaAbierta(false);
    setBusqueda(x.mun);
    setSeleccion(x.id);
    setTimeout(() => enfocarNodo(x.id), 50);
  };

  const limpiar = () => { setFiltros(FILTROS_INICIALES); setSeleccion(null); setBusqueda(''); if (modelo) setUmbral(modelo.cuantiles.p50); };

  // ---- nodo activo ----
  const activo = (seleccion || hover) && modelo ? modelo.porId.get(seleccion || hover) : null;
  const vecinosActivo = useMemo(() => {
    if (!activo || !modelo) return [];
    const lista = [];
    modelo.graph.forEachEdge(activo.id, (edge, attrs, s, tg) => {
      const otro = s === activo.id ? tg : s;
      lista.push({ id: otro, peso: attrs.weight, reg: modelo.porId.get(otro) });
    });
    lista.sort((a, b) => b.peso - a.peso);
    return lista.slice(0, 8);
  }, [activo, modelo]);

  const q = modelo ? modelo.cuantiles : null;
  const aristasVisibles = modelo && mostrarAristas ? aristasSobreUmbral(modelo.pesos, umbral) : 0;
  const logMin = q ? Math.log(q.min) : 0;
  const logTop = q ? Math.log(q.p99) : 1;
  const umbralSlider = q ? ((Math.log(Math.max(umbral, q.min)) - logMin) / (logTop - logMin || 1)) * 1000 : 0;
  const onSlider = (v) => { const u = Math.exp(logMin + (v / 1000) * (logTop - logMin)); setUmbral(Math.max(q.min, Math.round(u))); };

  const base = import.meta.env.BASE_URL;

  // ---- paneles ----
  const Stats = modelo && (
    <div className="panel-bloque">
      <div className="stats-mini">
        <div><strong>{formatoNumero(modelo.registros.length)}</strong><span>{ui.stats.municipios}</span></div>
        <div><strong>{formatoNumero(modelo.graph.size)}</strong><span>{ui.stats.aristas}</span></div>
        <div><strong>{formatoNumero(modelo.tomateros)}</strong><span>{ui.stats.tomateros}</span></div>
        <div><strong>{formatoNumero(visibles)}</strong><span>{ui.stats.visibles}</span></div>
      </div>
    </div>
  );

  const PanelNodo = (
    <div className="panel-bloque">
      <h4>{ui.nodoTitulo}</h4>
      {!activo ? (
        <p className="nodo-vacio">{ui.nodoAyuda}</p>
      ) : (
        <div>
          <div className="nodo-nombre">{activo.mun}</div>
          <div className="nodo-ubicacion">{activo.dep} · DANE {activo.id}</div>
          <div className="nodo-chips">
            <span className={`chip ${activo.tvapDom ? 'chip--tvap' : 'chip--btab'}`}><T>{activo.tvapDom ? ui.vectorTvap : ui.vectorBtab}</T></span>
            <span className="chip chip--tomate">{ui.cultivoOpciones[activo.tomate]}</span>
            <span className="chip">Comunidad {activo.lv}</span>
          </div>
          <h4 style={{ marginBottom: 4 }}>{ui.perfilVector}</h4>
          <div className="perfil-vector" title={atr.notaProvisional}>
            <div className="pista">
              <i className="btab" style={{ width: `${(activo.sBtab / (activo.sBtab + activo.sTvap)) * 100}%` }} />
              <i className="tvap" style={{ width: `${(activo.sTvap / (activo.sBtab + activo.sTvap)) * 100}%` }} />
            </div>
            <div className="extremos">
              <span><T>{atr.sBtab.corto}</T> <b>{activo.sBtab.toFixed(2)}</b></span>
              <span><T>{atr.sTvap.corto}</T> <b>{activo.sTvap.toFixed(2)}</b></span>
            </div>
          </div>
          <div className="nodo-metricas">
            <div><span><T>{atr.pAdd.largo}</T></span><strong>{activo.pAdd.toFixed(3)}</strong></div>
            <div><span><T>{atr.cBtab.corto}</T> / <T>{atr.cTvap.corto}</T></span><strong>{activo.cBtab.toFixed(3)} / {activo.cTvap.toFixed(3)}</strong></div>
            <div><span>{ui.invernadero} / {ui.campo}</span><strong>{formatoNumero(activo.inv, 1)} / {formatoNumero(activo.campo, 1)} {ui.ha}</strong></div>
            <div><span>{ui.bucle}</span><strong>{formatoNumero(activo.bucle)}</strong></div>
            <div><span>Intermediación</span><strong>{activo.bc.toExponential(2)} · {ui.ranking} {formatoNumero(modelo.rankBc.get(activo.id))} {ui.de} {formatoNumero(modelo.registros.length)}</strong></div>
            <div><span>PageRank</span><strong>{activo.pr.toExponential(2)} · {ui.ranking} {formatoNumero(modelo.rankPr.get(activo.id))}</strong></div>
            <div><span>{ui.grado}</span><strong>{formatoNumero(activo.grado)} · {ui.ranking} {formatoNumero(modelo.rankGrado.get(activo.id))}</strong></div>
            <div><span>Coordenadas (DANE)</span><strong>{activo.lat.toFixed(3)}, {activo.lon.toFixed(3)}</strong></div>
          </div>
          {vecinosActivo.length > 0 && (
            <div>
              <h4 style={{ marginTop: 12 }}>{ui.vecinos}</h4>
              <ul className="vecinos">
                {vecinosActivo.map((v) => (
                  <li key={v.id}>
                    <button onClick={() => { setSeleccion(v.id); enfocarNodo(v.id); }}>
                      <span>{v.reg.mun} <small style={{ color: 'var(--c-ink-3)' }}>({v.reg.dep})</small></span>
                      <span className="peso">{formatoNumero(v.peso)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const Leyenda = modelo && (
    <div className="panel-bloque">
      <h4>{ui.leyenda}</h4>
      {colorPor === 'vector' && (
        <div>
          <div className="leyenda-gradiente leyenda-gradiente--vector" />
          <div className="leyenda-extremos"><span><T>{ui.leyendaVector.btab}</T></span><span>{ui.leyendaVector.mixto}</span><span><T>{ui.leyendaVector.tvap}</T></span></div>
        </div>
      )}
      {colorPor === 'indice' && (
        <div>
          <div className="leyenda-gradiente leyenda-gradiente--metrica" />
          <div className="leyenda-extremos"><span>{ui.leyendaIndice.bajo}</span><span>{ui.leyendaIndice.alto}</span></div>
        </div>
      )}
      {colorPor === 'cultivo' && (
        <div className="leyenda-lista">{Object.entries(ui.cultivoOpciones).map(([k, v]) => <span key={k}><i style={{ background: COLOR_CULTIVO[k] }} />{v}</span>)}</div>
      )}
      {colorPor === 'comunidad' && (
        <div className="leyenda-lista">{modelo.comunidades.map((c) => <span key={c}><i style={{ background: colorCategoria(c, modelo.comunidades) }} />Comunidad {c}</span>)}</div>
      )}
      {colorPor === 'departamento' && (
        <div className="leyenda-lista">{modelo.departamentos.map((d) => <span key={d}><i style={{ background: colorCategoria(d, modelo.departamentos) }} />{d}</span>)}</div>
      )}
      {(colorPor === 'betweenness' || colorPor === 'pagerank') && (
        <div>
          <div className="leyenda-gradiente leyenda-gradiente--metrica" />
          <div className="leyenda-extremos"><span>{colorPor === 'betweenness' ? 'Intermediación' : 'PageRank'} {ui.leyendaMetrica.bajo}</span><span>{ui.leyendaMetrica.alto}</span></div>
        </div>
      )}
      <div className="leyenda-tamano"><i style={{ width: 6, height: 6 }} /><i style={{ width: 12, height: 12 }} /><i style={{ width: 18, height: 18 }} /> {ui.tamanoLeyenda} {ui.tamanoOpciones[tamanoPor].toLowerCase()}</div>
      <div className="leyenda-anillo"><i /> {ui.anilloTomate}</div>
      {(colorPor === 'vector' || colorPor === 'indice') && <p className="nota-provisional"><T>{atr.notaProvisional}</T></p>}
    </div>
  );

  const Filtros = modelo && (
    <div className="panel-bloque filtros">
      <h4>{ui.filtros}</h4>
      <div className="filtro">
        <label className="campo">{ui.departamento}
          <select value={filtros.dep} onChange={(e) => setFiltros((f) => ({ ...f, dep: e.target.value }))}>
            <option value="">{ui.todos}</option>
            {modelo.departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <div className="filtro">
        <label className="campo">{ui.vector}
          <select value={filtros.vector} onChange={(e) => setFiltros((f) => ({ ...f, vector: e.target.value }))}>
            <option value="todos">{ui.todos}</option>
            <option value="btab">{ui.vectorBtab}</option>
            <option value="tvap">{ui.vectorTvap}</option>
          </select>
        </label>
      </div>
      <div className="filtro">
        <span className="campo" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-ink-2)' }}>{ui.cultivo}</span>
        <div className="casillas" style={{ marginTop: 4 }}>
          {Object.entries(ui.cultivoOpciones).map(([k, v]) => (
            <label key={k}><input type="checkbox" checked={filtros.cultivo[k]} onChange={(e) => setFiltros((f) => ({ ...f, cultivo: { ...f.cultivo, [k]: e.target.checked } }))} /><i style={{ background: COLOR_CULTIVO[k] }} />{v}</label>
          ))}
        </div>
      </div>
      <div className="filtro">
        <label className="campo">{ui.comunidad}
          <select value={filtros.comunidad} onChange={(e) => setFiltros((f) => ({ ...f, comunidad: e.target.value }))}>
            <option value="">{ui.todos}</option>
            {modelo.comunidades.map((c) => <option key={c} value={c}>Comunidad {c}</option>)}
          </select>
        </label>
      </div>
      <div className="filtro">
        <label className="campo">{ui.colorPor}
          <select value={colorPor} onChange={(e) => setColorPor(e.target.value)}>
            {Object.entries(ui.colorOpciones).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <div className="filtro">
        <label className="campo">{ui.tamanoPor}
          <select value={tamanoPor} onChange={(e) => setTamanoPor(e.target.value)}>
            {Object.entries(ui.tamanoOpciones).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <div className="filtro">
        <label className="campo">{ui.posicion}
          <select value={posicion} onChange={(e) => setPosicion(e.target.value)}>
            {Object.entries(ui.posicionOpciones).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      {q && (
        <div className="filtro">
          <label className="campo">{ui.umbral}: {formatoNumero(umbral)} · {ui.aristas}: {formatoNumero(aristasVisibles)}
            <input type="range" min="0" max="1000" value={Math.round(umbralSlider)} onChange={(e) => onSlider(Number(e.target.value))} />
          </label>
          <div className="casillas" style={{ marginTop: 6 }}>
            <label><input type="checkbox" checked={mostrarAristas} onChange={(e) => setMostrarAristas(e.target.checked)} />{ui.mostrarAristas}</label>
          </div>
        </div>
      )}
      <div className="filtros-acciones">
        <button className="boton boton--claro boton--peq" onClick={limpiar}>{ui.limpiar}</button>
        <a className="boton boton--claro boton--peq" href={`${base}data/ToCV_red_municipios.gexf`} download>{ui.descargar}</a>
      </div>
    </div>
  );

  return (
    <section id="red" className="seccion seccion--oscura">
      <div className="contenedor contenedor--ancho">
        <div className="seccion-cabecera">
          <span className="seccion-kicker">{r.kicker}</span>
          <h2 className="seccion-titulo"><T>{r.titulo}</T></h2>
          <p className="seccion-lead"><T>{r.lead}</T></p>
        </div>

        <div className="redes-marco">
          <div className="redes-barra">
            <div className="buscador">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                type="search" placeholder={ui.buscar} value={busqueda} disabled={!modelo}
                onChange={(e) => { setBusqueda(e.target.value); setListaAbierta(true); }}
                onFocus={() => setListaAbierta(true)}
                onBlur={() => setTimeout(() => setListaAbierta(false), 150)}
                aria-label={ui.buscar}
              />
              {listaAbierta && busqueda.trim().length >= 2 && (
                <div className="buscador-lista">
                  {resultadosBusqueda.length === 0 && <div className="vacio">{ui.sinResultados}</div>}
                  {resultadosBusqueda.map((x) => (
                    <button key={x.id} onMouseDown={(e) => e.preventDefault()} onClick={() => elegirResultado(x)}>
                      <span>{x.mun}</span><small>{x.dep} · {x.tomate > 0 ? `${formatoNumero(x.area)} ha` : 'sin tomate'}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className="selector-inline">{ui.colorPor}
              <select value={colorPor} onChange={(e) => setColorPor(e.target.value)}>
                {Object.entries(ui.colorOpciones).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="redes-cuerpo">
            <div className="redes-lienzo">
              <div ref={contenedorRef} className="sigma-container" />
              <div className="redes-controles">
                <button onClick={acercar} title={ui.acercar} aria-label={ui.acercar}><Icono tipo="mas" /></button>
                <button onClick={alejar} title={ui.alejar} aria-label={ui.alejar}><Icono tipo="menos" /></button>
                <button onClick={recentrar} title={ui.recentrar} aria-label={ui.recentrar}><Icono tipo="centrar" /></button>
              </div>
              {modelo && colorPor === 'vector' && (
                <div className="redes-leyenda-flotante">
                  <h5>{ui.colorOpciones.vector}</h5>
                  <div className="leyenda-gradiente leyenda-gradiente--vector" style={{ margin: '2px 0 4px' }} />
                  <div className="leyenda-extremos"><span><T>{ui.leyendaVector.btab}</T></span><span><T>{ui.leyendaVector.tvap}</T></span></div>
                </div>
              )}
              {carga.activo && (
                <div className="redes-carga">
                  <div>
                    <div className="spinner" />
                    <div>{ui.cargando} (≈0,26 MB)</div>
                    {carga.progreso != null && <div className="barra"><i style={{ width: `${Math.round(carga.progreso * 100)}%` }} /></div>}
                  </div>
                </div>
              )}
              {error && <div className="redes-carga"><div>Error al cargar la red: {error}</div></div>}
            </div>

            <aside className="redes-panel">
              {Stats}
              {PanelNodo}
              {Leyenda}
              {Filtros}
            </aside>
          </div>
        </div>

        <div className="como-leer">
          <details open>
            <summary>{r.comoLeer.titulo}</summary>
            <ul>{r.comoLeer.items.map((p, k) => <li key={k}><T>{p}</T></li>)}</ul>
          </details>
        </div>
      </div>
    </section>
  );
}

export default RedTransmision;
