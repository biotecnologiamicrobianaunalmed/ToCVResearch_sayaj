import React, { useEffect, useState } from 'react';
import './Navbar.css';

function Navbar({ t }) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState('inicio');
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const secciones = t.nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!('IntersectionObserver' in window) || secciones.length === 0) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const visibles = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibles[0]) setActivo(visibles[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] }
    );
    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [t.nav]);

  const ir = (id) => (e) => {
    e.preventDefault();
    setAbierto(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`nav ${solido || abierto ? 'nav--solida' : ''}`}>
      <div className="nav-interior">
        <a href="#inicio" className="nav-marca" onClick={ir('inicio')}>
          <span className="nav-marca-icono" aria-hidden="true">
            {/* mosca blanca estilizada: dos alas y cuerpo */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <ellipse cx="12" cy="13" rx="2.2" ry="5" />
              <path d="M10 11C5 7.5 3.5 12 8 15Z" opacity=".9" />
              <path d="M14 11C19 7.5 20.5 12 16 15Z" opacity=".9" />
              <circle cx="12" cy="6.5" r="1.6" />
            </svg>
          </span>
          <span className="nav-marca-texto">ToCV <span>Colombia</span></span>
        </a>
        <button className="nav-hamburguesa" aria-label="Abrir menú" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}>
          <span /><span /><span />
        </button>
        <nav className={`nav-enlaces ${abierto ? 'nav-enlaces--abierto' : ''}`} aria-label="Secciones">
          {t.nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={ir(n.id)} className={activo === n.id ? 'activo' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
