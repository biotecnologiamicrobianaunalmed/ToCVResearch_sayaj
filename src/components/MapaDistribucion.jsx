import React, { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import T from '../lib/cientifico.jsx';
import EPPO from '../data/eppo_paises_pendiente_verificacion.json';
import './MapaDistribucion.css';

export const TILES = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  referencia: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
};

const VISTAS = {
  mundo: { bounds: [[-45, -125], [62, 150]] },
  sudamerica: { bounds: [[-40, -85], [14, -32]] },
  colombia: { bounds: [[-4.5, -80], [13, -66]] },
};

const COLOMBIA = { lat: 4.3, lon: -73.5 };

function Vista({ vista }) {
  const map = useMap();
  useEffect(() => {
    map.flyToBounds(VISTAS[vista].bounds, { duration: 1.1, padding: [10, 10] });
  }, [vista, map]);
  return null;
}

function icono(p, zoom) {
  const presente = p.estatus.startsWith('Present');
  const grande = zoom >= 3;
  const tam = grande ? 30 : 18;
  const clase = `pais-marcador ${presente ? 'pais-marcador--presente' : 'pais-marcador--erradicado'} ${grande ? 'pais-marcador--grande' : ''}`;
  const html = grande && p.anio ? `<span>${p.anio}</span>` : '';
  return L.divIcon({ className: clase, html, iconSize: [tam, tam], iconAnchor: [tam / 2, tam / 2] });
}

function iconoColombia(zoom) {
  const tam = zoom >= 3 ? 34 : 20;
  return L.divIcon({ className: 'pais-marcador pais-marcador--colombia', html: zoom >= 4 ? '<span>?</span>' : '', iconSize: [tam, tam], iconAnchor: [tam / 2, tam / 2] });
}

function Zoom({ onZoom }) {
  const map = useMap();
  useEffect(() => {
    const h = () => onZoom(map.getZoom());
    h();
    map.on('zoomend', h);
    return () => map.off('zoomend', h);
  }, [map, onZoom]);
  return null;
}

function MapaDistribucion({ t }) {
  const m = t.mapa;
  const [vista, setVista] = useState('mundo');
  const [zoom, setZoom] = useState(2);
  const [tablaAbierta, setTablaAbierta] = useState(false);
  const paises = useMemo(() => EPPO.paises.filter((p) => p.mostrar), []);
  const presentes = paises.filter((p) => p.estatus.startsWith('Present'));
  const porRegion = useMemo(() => {
    const g = {};
    presentes.forEach((p) => { g[p.region] = (g[p.region] || 0) + 1; });
    return g;
  }, [presentes]);

  return (
    <section id="mapa" className="seccion">
      <div className="contenedor contenedor--ancho">
        <div className="seccion-cabecera">
          <span className="seccion-kicker">{m.kicker}</span>
          <h2 className="seccion-titulo"><T>{m.titulo}</T></h2>
          <p className="seccion-lead"><T>{m.lead}</T></p>
        </div>

        <div className="mapa-marco">
          <div className="mapa-barra">
            <div className="segmentado" role="group" aria-label="Vista">
              {Object.entries(m.vistas).map(([k, v]) => (
                <button key={k} className={vista === k ? 'activo' : ''} onClick={() => setVista(k)}>{v}</button>
              ))}
            </div>
            <div className="mapa-resumen">
              <strong>{presentes.length}</strong> presentes · {Object.entries(porRegion).map(([r, n]) => `${r} ${n}`).join(' · ')}
            </div>
          </div>
          <div className="mapa-cuerpo">
            <MapContainer bounds={VISTAS.mundo.bounds} minZoom={2} maxZoom={9} worldCopyJump scrollWheelZoom={false} className="mapa-leaflet" attributionControl>
              <TileLayer url={TILES.url} attribution={TILES.attribution} />
              <TileLayer url={TILES.referencia} />
              <Vista vista={vista} />
              <Zoom onZoom={setZoom} />
              {paises.map((p) => (
                <Marker key={p.iso} position={[p.lat, p.lon]} icon={icono(p, zoom)}>
                  <Tooltip direction="top" offset={[0, -12]} opacity={0.96}>
                    <div className="mapa-tooltip">
                      <strong>{p.pais}</strong>
                      <span>{p.estatus}</span>
                      {p.anio && <span>Primer reporte: {p.anio}</span>}
                      {p.nota && <small>{p.nota}</small>}
                    </div>
                  </Tooltip>
                </Marker>
              ))}
              <Marker position={[COLOMBIA.lat, COLOMBIA.lon]} icon={iconoColombia(zoom)}>
                <Tooltip direction="top" offset={[0, -14]} opacity={0.96}>
                  <div className="mapa-tooltip">
                    <strong>Colombia</strong>
                    <span>{m.leyenda.sinRegistro}</span>
                  </div>
                </Tooltip>
              </Marker>
            </MapContainer>
            <aside className="mapa-panel">
              <h4>{m.leyenda.titulo}</h4>
              <div className="mapa-leyenda">
                <span><i className="ley ley--presente" />{m.leyenda.presente}</span>
                <span><i className="ley ley--erradicado" />{m.leyenda.erradicado}</span>
                <span><i className="ley ley--colombia" />{m.leyenda.sinRegistro}</span>
              </div>
              <p className="nota"><T>{m.leyenda.anio}</T></p>
              <h4 style={{ marginTop: 14 }}>{m.colombia.titulo}</h4>
              <p className="mapa-texto"><T>{m.colombia.texto}</T></p>
            </aside>
          </div>
        </div>

        <div className="aviso" style={{ marginTop: 18 }}>
          <span aria-hidden="true">⚠️</span>
          <div><strong>Pendiente de verificación.</strong> {m.aviso}</div>
        </div>

        <details className="mapa-tabla" open={tablaAbierta} onToggle={(e) => setTablaAbierta(e.target.open)}>
          <summary>{m.tablaTitulo} · {paises.length} entradas</summary>
          <div className="tabla-envoltura" style={{ marginTop: 10 }}>
            <table className="tabla">
              <thead><tr>{m.columnas.map((c) => <th key={c}><T>{c}</T></th>)}</tr></thead>
              <tbody>
                {paises.map((p) => (
                  <tr key={p.iso}>
                    <td>{p.pais}{p.nota ? <span className="nota"> · {p.nota}</span> : null}</td>
                    <td>{p.region}</td>
                    <td><span className={`chip ${p.estatus.startsWith('Present') ? '' : 'chip--alerta'}`}>{p.estatus}</span></td>
                    <td>{p.anio || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <ul className="fuentes">
          {m.fuentes.map((f) => <li key={f}><T>{f}</T></li>)}
        </ul>
      </div>
    </section>
  );
}

export default MapaDistribucion;
