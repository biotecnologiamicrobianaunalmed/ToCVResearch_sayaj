import React from 'react';
import T from '../lib/cientifico.jsx';
import './Hero.css';

const irA = (id) => (e) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Hero({ t }) {
  const h = t.hero;
  return (
    <section id="inicio" className="hero">
      <div className="hero-contenido">
        <div className="hero-texto">
          <span className="hero-badge"><T>{h.badge}</T></span>
          <h1 className="hero-titulo"><T>{h.titulo}</T></h1>
          <p className="hero-subtitulo"><T>{h.subtitulo}</T></p>
          <div className="hero-autor">
            <strong>{h.afiliacion}</strong>
            <span>{h.programa}</span>
          </div>
          <div className="hero-acciones">
            <a href="#red" className="boton boton--primario" onClick={irA('red')}>{h.cta1}</a>
            <a href="#mapa" className="boton boton--secundario" onClick={irA('mapa')}>{h.cta2}</a>
          </div>
          <ul className="hero-stats">
            {h.stats.map((s) => (
              <li key={s.label}><strong>{s.valor}</strong><span><T>{s.label}</T></span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Hero;
