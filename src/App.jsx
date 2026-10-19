import React from 'react';
import './App.css';
import es from './content/es.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import { Virus, Vectores, Colombia, Datos } from './components/Secciones.jsx';
import MapaDistribucion from './components/MapaDistribucion.jsx';
import RedTransmision from './components/RedTransmision.jsx';
import Footer from './components/Footer.jsx';

// Para agregar un selector de idioma: crear content/en.js con la misma estructura y elegir aquí.
const t = es;

export default function App() {
  return (
    <div className="app">
      <Navbar t={t} />
      <main>
        <Hero t={t} />
        <Virus t={t} />
        <Vectores t={t} />
        <MapaDistribucion t={t} />
        <RedTransmision t={t} />
        <Colombia t={t} />
        <Datos t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
