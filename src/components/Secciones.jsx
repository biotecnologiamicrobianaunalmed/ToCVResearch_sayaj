import React from 'react';
import T from '../lib/cientifico.jsx';
import './Secciones.css';

function Cabecera({ kicker, titulo, lead }) {
  return (
    <div className="seccion-cabecera">
      <span className="seccion-kicker">{kicker}</span>
      <h2 className="seccion-titulo"><T>{titulo}</T></h2>
      {lead && <p className="seccion-lead"><T>{lead}</T></p>}
    </div>
  );
}

// ---------------------------------------------------------------- 01 El virus
export function Virus({ t }) {
  const v = t.virus;
  const base = import.meta.env.BASE_URL;
  return (
    <section id="virus" className="seccion">
      <div className="contenedor">
        <Cabecera kicker={v.kicker} titulo={v.titulo} lead={v.lead} />
        <figure className="figura">
          <img src={`${base}${v.genoma.figura.src}`} alt={v.genoma.figura.alt} loading="lazy" width="960" height="410" />
          <figcaption><T>{v.genoma.figura.pie}</T></figcaption>
        </figure>
        <div className="rejilla rejilla--3" style={{ marginTop: 18 }}>
          <div className="tarjeta tarjeta--acento">
            <h3>{v.genoma.titulo}</h3>
            <ul className="lista-puntos">{v.genoma.texto.map((p, i) => <li key={i}><T>{p}</T></li>)}</ul>
            <h3 style={{ marginTop: 16 }}>{v.taxonomia.titulo}</h3>
            <table className="tabla tabla--taxonomia">
              <tbody>
                {v.taxonomia.filas.map(([k, val]) => (
                  <tr key={k}><th scope="row">{k}</th><td><T>{val}</T></td></tr>
                ))}
              </tbody>
            </table>
            <p className="nota" style={{ marginTop: 8 }}><T>{v.taxonomia.nota}</T></p>
          </div>
          <div className="tarjeta">
            <h3>{v.sintomas.titulo}</h3>
            <ol className="lista-numerada">
              {v.sintomas.items.map((s, i) => <li key={i}><T>{s}</T></li>)}
            </ol>
          </div>
          <div className="tarjeta">
            <h3>{v.hospedantes.titulo}</h3>
            <div className="chips" style={{ marginBottom: 12 }}>
              {v.hospedantes.chips.map((c) => <span className="chip chip--tomate" key={c}>{c}</span>)}
            </div>
            <p><T>{v.hospedantes.texto}</T></p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- 02 Vectores
export function Vectores({ t }) {
  const v = t.vectores;
  const maxDias = Math.max(...v.eficiencia.retencion.map((r) => r.dias));
  return (
    <section id="vectores" className="seccion seccion--alt">
      <div className="contenedor">
        <Cabecera kicker={v.kicker} titulo={v.titulo} lead={v.lead} />
        <ol className="pasos" aria-label={v.pasos.titulo}>
          {v.pasos.items.map((p, i) => (
            <li key={p.k}><span className="pasos-num">{i + 1}</span><div><strong>{p.t}</strong><p><T>{p.d}</T></p></div></li>
          ))}
        </ol>
        <div className="rejilla rejilla--3">
          {v.tarjetas.map((c) => (
            <article className={`tarjeta tarjeta--${c.k === 'btab' ? 'btab' : c.k === 'tvap' ? 'tvap' : 'acento'} vector-tarjeta`} key={c.k}>
              <div className="vector-icono" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="42" height="42">
                  <path d="M20 22C8 14 4 24 16 30Z" fill={c.k === 'btab' ? '#ffb08a' : c.k === 'tvap' ? '#9fe6f2' : '#ffd98a'} opacity=".95" />
                  <path d="M28 22C40 14 44 24 32 30Z" fill={c.k === 'btab' ? '#ffb08a' : c.k === 'tvap' ? '#9fe6f2' : '#ffd98a'} opacity=".95" />
                  {c.k === 'tabu' && <path d="M10 24h12M26 24h12" stroke="#0b1522" strokeWidth="2" />}
                  <ellipse cx="24" cy="26" rx="4" ry="9" fill="#f6f1e4" />
                  <circle cx="24" cy="14" r="3.2" fill="#f6f1e4" />
                </svg>
              </div>
              <h3><T>{c.titulo}</T></h3>
              <p className="nota" style={{ marginBottom: 10 }}><T>{c.sub}</T></p>
              <ul className="lista-puntos">
                {c.puntos.map((p, i) => <li key={i}><T>{p}</T></li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="rejilla rejilla--2" style={{ marginTop: 18 }}>
          <div className="tarjeta">
            <h3>{v.eficiencia.titulo}</h3>
            <p><T>{v.eficiencia.texto}</T></p>
            <ol className="orden-eficiencia">
              {v.eficiencia.orden.map((o, i) => <li key={o}><span>{i + 1}</span><T>{o}</T></li>)}
            </ol>
            <h4 className="subtitulo-peq">{v.eficiencia.retencionTitulo}</h4>
            <div className="barras">
              {v.eficiencia.retencion.map((r) => (
                <div className="barra-fila" key={r.vector}>
                  <span className="barra-etiqueta"><T>{r.vector}</T></span>
                  <div className="barra-pista"><i className={r.vector.includes('vaporariorum') ? 'barra--tvap' : r.vector.includes('tabaci') ? 'barra--btab' : 'barra--acento'} style={{ width: `${(r.dias / maxDias) * 100}%` }} /></div>
                  <span className="barra-valor">{r.texto || r.dias} d <T>{r.fuente}</T></span>
                </div>
              ))}
            </div>
          </div>
          <div className="tarjeta">
            <h3>{v.epidemiologia.titulo}</h3>
            <ol className="lista-numerada">
              {v.epidemiologia.items.map((s, i) => <li key={i}><T>{s}</T></li>)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- 05 Colombia
export function Colombia({ t }) {
  const c = t.colombia;
  return (
    <section id="colombia" className="seccion seccion--alt">
      <div className="contenedor">
        <Cabecera kicker={c.kicker} titulo={c.titulo} lead={c.lead} />
        <div className="rejilla rejilla--2">
          {c.tarjetas.map((k) => (
            <div className="tarjeta" key={k.titulo}>
              <h3><T>{k.titulo}</T></h3>
              <p><T>{k.texto}</T></p>
            </div>
          ))}
        </div>
        <div className="aviso" style={{ marginTop: 18 }}>
          <span aria-hidden="true">⏳</span>
          <div><strong>{c.pendiente.titulo}.</strong> <T>{c.pendiente.texto}</T></div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- 06 Datos y referencias
export function Datos({ t }) {
  const d = t.datos;
  const base = import.meta.env.BASE_URL;
  return (
    <section id="datos" className="seccion">
      <div className="contenedor">
        <Cabecera kicker={d.kicker} titulo={d.titulo} lead={d.lead} />
        <div className="rejilla rejilla--2">
          <div className="tarjeta">
            <h3>Archivos</h3>
            <ul className="archivos">
              {d.archivos.map((a) => (
                <li key={a.ruta}>
                  <a className="boton boton--claro boton--peq" href={`${base}${a.ruta}`} download>{a.nombre}</a>
                  <span className="nota">{a.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tarjeta">
            <h3>{d.metodologia.titulo}</h3>
            <ol className="lista-numerada">
              {d.metodologia.items.map((s, i) => <li key={i}><T>{s}</T></li>)}
            </ol>
          </div>
        </div>
        <h3 className="subtitulo" style={{ marginTop: 32 }}>{d.referenciasTitulo}</h3>
        <ol className="referencias">
          {d.referencias.map((r) => (
            <li key={r.n} id={`ref-${r.n}`}>
              <span className="ref-num">{r.n}</span>
              <span><T>{r.texto}</T> {r.url && <a href={r.url} target="_blank" rel="noreferrer">{r.url.replace(/^https?:\/\//, '')}</a>}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
