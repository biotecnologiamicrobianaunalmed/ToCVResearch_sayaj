# ToCV en Colombia · sitio web

Sitio científico interactivo sobre el *Crinivirus tomatichlorosis* (tomato chlorosis virus, ToCV), sus vectores
(moscas blancas *Bemisia tabaci* y *Trialeurodes vaporariorum*), su distribución mundial y una red espacial de
transmisión entre municipios de Colombia.

Grupo de Investigación Biotecnología Microbiana · Universidad Nacional de Colombia, Sede Medellín.

Publicación prevista en GitHub Pages: <https://biotecnologiamicrobianaunalmed.github.io/ToCVResearch_sayaj/>
(sitio hermano: [ToBRFV en Colombia](https://biotecnologiamicrobianaunalmed.github.io/ToBRFVResearch_sayaj/)).

## Qué contiene

- **Inicio**: resumen, cifras clave y diagrama de la transmisión semipersistente.
- **El virus**: taxonomía ICTV, genoma bipartito a escala (figura SVG original desde GenBank NC_007340/NC_007341), síntomas y hospedantes.
- **Vectores**: *B. tabaci* (MEAM1, MED, NW), *T. vaporariorum* y *T. abutilonea*; eficiencia, días de retención y epidemiología, en frases breves con citas.
- **Mapa mundial** (Leaflet): países con presencia según la EPPO, año del primer reporte, vistas Mundo → Sudamérica → Colombia.
- **Red de transmisión** (sigma.js + graphology sobre Leaflet): 1090 municipios y 4093 aristas (8125 dirigidas fusionadas),
  color por vector dominante, tamaño por área de tomate o centralidad, búsqueda, filtros, resaltado de vecinos,
  leyenda, panel del municipio y guía de lectura.
- **Colombia**: contexto; preparada para incorporar resultados cuando se publiquen.
- **Datos y referencias**: descargas (GEXF original, JSON del visor, lista EPPO) y bibliografía enlazada.

Todo el texto visible está en `src/content/es.js` (las marcas `[n]` enlazan a las referencias y los nombres
científicos se ponen en cursiva automáticamente con `src/lib/cientifico.jsx`).

## Desarrollo

```bash
npm install
npm run dev       # servidor local (http://localhost:5173/ToCVResearch_sayaj/)
npm run build     # compila en dist/
npm run preview   # sirve dist/ localmente
npm run data      # regenera public/data/red_tocv.json desde datos/*.gexf
```

Stack: Vite 8, React 19, sigma 3 (+ `@sigma/layer-leaflet`, `@sigma/node-border`), graphology, Leaflet 1.9, react-leaflet 5.

## Publicación

El flujo `.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main`
(en el repositorio: Settings → Pages → Source: *GitHub Actions*). Alternativa manual: `npm run deploy` (gh-pages).

## Datos

- `datos/ToCV_rep1000_6km_whiteflies_and_tomato_centrality_louvain.gexf`: red original (NetworkX 3.2.1, dirigida,
  1090 nodos = municipios con código DANE, 9215 aristas de las cuales 1090 son bucles).
- `scripts/build_network_data.py`: convierte el GEXF a `public/data/red_tocv.json` (≈260 KB), asigna centroides
  oficiales DANE (MGN 2023, `scripts/dane_centroides_mgn2023.json`), conserva la posición original (cabecera) y
  escribe `docs/centroides_discrepancias_mayores_15km.md`.
- `src/data/eppo_paises_pendiente_verificacion.json`: lista EPPO (2026-07-28) con estatus y año de primer reporte.
- `docs/investigacion_y_analisis_red.md`: notas de investigación con todas las fuentes consultadas.

## Pendientes

Ver `PENDIENTES_VERIFICACION.md` (atributos del vector con nombres provisionales, lista de países, posiciones).

Las carpetas `Referencias/` y `docs/privado/` (documentos de trabajo privados) están excluidas del repositorio mediante `.gitignore`.
