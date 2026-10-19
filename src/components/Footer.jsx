import React from 'react';
import T from '../lib/cientifico.jsx';
import './Footer.css';

function Footer({ t }) {
  const p = t.pie;
  return (
    <footer className="pie">
      <div className="contenedor">
        <p><T>{p.texto}</T></p>
        <p className="nota"><T>{p.nota}</T> · <a href={p.repoUrl} target="_blank" rel="noreferrer">{p.repo}</a> · <a href={p.hermanoUrl} target="_blank" rel="noreferrer">{p.hermano}</a></p>
      </div>
    </footer>
  );
}

export default Footer;
