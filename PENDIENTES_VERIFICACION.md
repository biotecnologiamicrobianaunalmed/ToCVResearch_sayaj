# Pendientes de verificación por la autora (antes de publicar)

Estado al 2026-10-19. Marcar cada punto cuando quede resuelto.

## 1. Atributos del vector en la red (prioridad alta)

Los nodos del GEXF traen seis atributos de mosca blanca cuyo significado exacto no está documentado:
`pAdd`, `cBtab`, `cTvap`, `sBtab`, `sTvap`, `Tvap_dominant` (Btab = *Bemisia tabaci*, Tvap = *Trialeurodes vaporariorum*).
En el sitio se muestran con **etiquetas neutras y provisionales** definidas en `src/content/es.js` → `red.atributos`
("Índice B. tabaci", "Índice T. vaporariorum", "Índice combinado", "Proporción relativa…"). Cuando se confirme la
definición con quien construyó la red, basta cambiar allí los textos `corto`, `largo` y `ayuda`, y borrar `notaProvisional`.

Lo que se verificó numéricamente en los 1090 nodos (ver `docs/investigacion_y_analisis_red.md`, sección 10):

- `pAdd = cBtab + cTvap` exactamente (error máximo 7e-7).
- `Tvap_dominant = 1` si y solo si `sTvap > 0,5` (se cumple en 1090/1090; la regla `sTvap > sBtab` falla en 14).
- `sBtab + sTvap = 1` en 803 nodos (allí `sBtab = cBtab / pAdd`); en 287 nodos la suma está entre 0,31 y 0,999,
  casi todos municipios fríos de Boyacá, Cundinamarca, Nariño y Santander con `pAdd` bajo (mediana 0,27).
- Rangos: pAdd 0,011–1,000; cBtab 0,00003–0,51; cTvap 0,011–0,505; sBtab 0,001–0,53; sTvap 0,306–0,998.
- `pAdd` es alto en tierras bajas cálidas (Chocó, Meta, Córdoba > 0,95) y bajo en páramos y altiplanos
  (El Cocuy 0,016, Vetas 0,026, Bogotá 0,020).

Hipótesis (NO confirmadas, no se afirman en el sitio):

- H1 · `pAdd` sería la probabilidad o idoneidad combinada ("aditiva") de presencia de moscas blancas en el municipio,
  y `cBtab`/`cTvap` la contribución de cada especie a esa idoneidad (c = "contribution"/"componente").
- H2 · `sBtab`/`sTvap` serían la participación ("share") de cada especie. En los 803 nodos "normales" es exactamente
  c/pAdd; en los 287 restantes parece haberse aplicado un ajuste adicional (por ejemplo, una penalización por
  temperatura o altitud, o una fuente de datos distinta) que reduce ambas proporciones por debajo de 1.
- H3 · Alternativa para H2: en esos 287 nodos las proporciones podrían venir de datos de campo (conteos de especies)
  y el remanente hasta 1 corresponder a otras especies o a individuos no identificados.

## 2. Posiciones de los nodos

- Se usan los centroides oficiales del DANE (MGN 2023, capa `MGN_ADM_MPIO_GRAFICO`, centroide ponderado por área,
  `scripts/dane_centroides_mgn2023.json`). Los 1090 códigos DANE del GEXF tienen centroide.
- Las posiciones originales del GEXF corresponden a la **cabecera municipal**, no al centroide del polígono:
  165 municipios difieren más de 15 km (lista completa en `docs/centroides_discrepancias_mayores_15km.md`;
  los extremos son Solano 242 km, El Retorno 117 km, Paz de Ariporo 112 km, Cartagena del Chairá 98 km).
  El visor permite alternar entre ambas posiciones ("Posición de los nodos"). Decidir cuál debe ser la predeterminada.

## 3. Lista de países (mapa mundial)

- `src/data/eppo_paises_pendiente_verificacion.json`: transcrita de <https://gd.eppo.int/taxon/TOCV00/distribution>
  el 2026-10-19 (página actualizada por la EPPO el 2026-07-28). 41 entradas "Present" y 2 "Absent" (Reino Unido
  erradicado, Bélgica sin registro). Revisar país por país; cambiar `"mostrar": false` para excluir uno.
- Años de primer reporte tomados de la Tabla 1 de Fiallo-Olivé & Navas-Castillo (2019); Argentina (2023) de la página
  EPPO del país. Siete países sin año (Egipto, Kenia, República Dominicana, India, Pakistán, Uzbekistán, Albania).
- Coordenadas de países: centroides aproximados, solo para ubicar los círculos.
- No se pudo consultar CABI Compendium (acceso denegado).

## 4. Datos biológicos con discrepancias entre fuentes

- Número de países: Fiallo-Olivé & Navas-Castillo 2019 (35), 2023 ("al menos 39"); EPPO 2026-07-28: 41. El sitio usa 41.
- Nombres de proteínas: la revisión de 2019 nombra p6, p59, p4, p8, p7; GenBank (NC_007340.1 / NC_007341.1) usa P5 (ARN1), P4,
  P8, P59, P9, CP, CPm, P27, P7 (ARN2). El sitio y la figura del genoma siguen GenBank.
- Grafía "T. abutilonea" (EPPO, Wintermantel) frente a "T. abutiloneus" en parte de la literatura.

## 5. Contenido no publicado

- El sitio solo muestra literatura publicada y la red de transmisión. La sección "Colombia" tiene un aviso de resultados
  pendientes; al publicarse nuevos resultados, agregarlos en `src/content/es.js` → `colombia`.
- No se usa la expresión "primer reporte"; se dice "sin reportes en las bases consultadas".

## 6. Taxonomía

- El nombre *Crinivirus tomatichlorosis* se confirmó en NCBI Taxonomy (TaxID 3428120), EPPO y USDA-APHIS, pero no se
  pudo abrir la ficha de la especie en ictv.global. Confirmar contra la Master Species List vigente.

## 7. Figuras científicas

- `public/figuras/genoma_tocv.svg` (vista previa `docs/figuras/genoma_tocv.png`): aprobada e integrada en "El virus".
  ARN1 y ARN2 a escala con los ORF y productos de GenBank NC_007340.1 y NC_007341.1; se regenera con `python3 scripts/figura_genoma.py`.
- Figura de transmisión: descartada por la autora (2026-10-19); se conserva solo el texto breve con citas y el diagrama del inicio.
