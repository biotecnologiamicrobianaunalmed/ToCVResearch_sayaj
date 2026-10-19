// Contenido en español del sitio. Todo el texto visible vive aquí para poder revisarlo y
// traducirlo sin tocar los componentes. Las marcas [n] enlazan con la lista de referencias
// (sección Datos y referencias, campo `referencias`). Los nombres científicos se ponen en
// cursiva automáticamente al renderizar (src/lib/cientifico.jsx).
//
// Fuentes prioritarias: Fiallo-Olivé & Navas-Castillo 2019 y 2023, Wintermantel & Wisler 2006,
// Shi et al. 2018, EPPO Global Database (TOCV00), NCBI Taxonomy y GenBank (NC_007340, NC_007341).
// Ver docs/investigacion_y_analisis_red.md y docs/textos_antes_despues.md.

const es = {
  idioma: 'es',
  nav: [
    { id: 'inicio', label: 'Inicio' },
    { id: 'virus', label: 'El virus' },
    { id: 'vectores', label: 'Vectores' },
    { id: 'mapa', label: 'Mapa mundial' },
    { id: 'red', label: 'Red de transmisión' },
    { id: 'colombia', label: 'Colombia' },
    { id: 'datos', label: 'Datos y referencias' },
  ],

  hero: {
    badge: 'Crinivirus tomatichlorosis · ToCV',
    titulo: 'El virus de la clorosis del tomate y sus moscas blancas vectoras en Colombia',
    subtitulo:
      'Un crinivirus bipartito, limitado al floema, transmitido de forma semipersistente por Bemisia tabaci y Trialeurodes vaporariorum. Biología, distribución mundial y una red de municipios conectados por el vuelo de las moscas blancas.',
    programa: 'Grupo de Investigación Biotecnología Microbiana',
    afiliacion: 'Universidad Nacional de Colombia, Sede Medellín',
    cta1: 'Explorar la red',
    cta2: 'Ver el mapa mundial',
    stats: [
      { valor: '2', label: 'segmentos de ARN (≈8,6 y ≈8,2 kb) [2]' },
      { valor: '5', label: 'taxones de mosca blanca vectores [2,5]' },
      { valor: '84', label: 'especies hospedantes en 25 familias [2]' },
      { valor: '41', label: 'países y territorios con presencia (EPPO, 2026) [9]' },
    ],
  },

  virus: {
    kicker: '01 · El virus',
    titulo: 'Un crinivirus bipartito confinado al floema',
    lead: 'Descrito en 1998 en tomates de invernadero de Florida, con síntomas observados desde 1989 [1]. Hoy es uno de los virus emergentes más extendidos del tomate [2].',
    taxonomia: {
      titulo: 'Taxonomía (ICTV)',
      filas: [
        ['Dominio', 'Riboviria'],
        ['Reino', 'Orthornavirae'],
        ['Filo', 'Kitrinoviricota'],
        ['Clase', 'Alsuviricetes'],
        ['Orden', 'Martellivirales'],
        ['Familia', 'Closteroviridae'],
        ['Género', 'Crinivirus'],
        ['Especie', 'Crinivirus tomatichlorosis'],
        ['Nombre común', 'tomato chlorosis virus (ToCV)'],
      ],
      nota: 'NCBI Taxonomy TaxID 3428120; EPPO TOCV00 [8,9].',
    },
    genoma: {
      titulo: 'Genoma y partícula',
      texto: [
        'Dos ARN de sentido positivo, cada uno en un virión filamentoso de 800–850 nm [1,2].',
        'ARN1, 8595 nt: replicación (ORF1a, RdRp) y P22, supresor del silenciamiento [2,3,25].',
        'ARN2, 8247 nt: HSP70h, P59, cápsides CP y CPm, P27 y proteínas menores [2,4,26].',
        'Masas: 1a 221 kDa, RdRp 59 kDa, CP 29 kDa, CPm 76 kDa [2].',
      ],
      figura: {
        src: 'figuras/genoma_tocv.svg',
        alt: 'Organización genómica del ToCV: ARN1 y ARN2 a escala con sus marcos de lectura.',
        pie: 'Figura original a escala según GenBank NC_007340.1 y NC_007341.1 (aislado Florida) [3,25,26].',
      },
    },
    sintomas: {
      titulo: 'Síntomas en tomate',
      items: [
        'Clorosis intervenal poligonal, de hojas bajas al ápice [2,9].',
        'Hojas gruesas y quebradizas; bronceado necrótico tardío [2,9].',
        'Menos frutos y más pequeños: pérdidas de 0,2 a 51,8 % en 15 genotipos [2,9,10].',
        'Se confunde con deficiencias de Mg o S y con el TICV [2,9,11].',
      ],
    },
    hospedantes: {
      titulo: 'Hospedantes',
      texto:
        '84 especies en 25 familias [2]. Cultivos: tomate (Solanum lycopersicum), pimentón (Capsicum annuum), papa (Solanum tuberosum, con paso a tubérculos), berenjena, lechuga y uchuva (Physalis peruviana) [9,12]. Arvenses reservorio: Solanum nigrum, Solanum americanum, Nicandra physalodes, Physalis angulata, Amaranthus retroflexus, Sonchus oleraceus, Chenopodium album, Datura stramonium [9,13,14].',
      chips: ['Tomate', 'Pimentón', 'Papa', 'Berenjena', 'Lechuga', 'Uchuva', 'Arvenses'],
    },
  },

  vectores: {
    kicker: '02 · Vectores y transmisión',
    titulo: 'Las moscas blancas son la única vía de transmisión conocida',
    lead:
      'Transmisión semipersistente, no circulativa, por cinco taxones de moscas blancas (Hemiptera: Aleyrodidae) [2,5]. Carga viral máxima a las 48 h de alimentación [6]. Sin transmisión por semilla ni mecánica [6,9].',
    pasos: {
      titulo: 'Transmisión semipersistente en tres pasos',
      items: [
        { k: 'adquisicion', t: 'Adquisición', d: 'En el floema; carga máxima a las 48 h [6].' },
        { k: 'retencion', t: 'Retención', d: 'Intestino anterior, sin replicación: 1 día T. vaporariorum, 2 MEAM1, más de 4 MED [5,6].' },
        { k: 'inoculacion', t: 'Inoculación', d: 'En una planta sana. Sin transmisión por semilla ni mecánica [6,9].' },
      ],
    },
    tarjetas: [
      {
        k: 'btab',
        titulo: 'Bemisia tabaci',
        sub: 'MEAM1 (ex B), MED (ex Q), NW (ex A)',
        puntos: [
          'MEAM1: muy eficiente; retención 2 días; ~40 adultos transmiten casi al 100 % [5].',
          'MED: más adquisición que MEAM1; retención > 4 días [6].',
          'NW: menos eficiente; retención 1 día [5].',
          'Colombia: tierras bajas, costa Atlántica 0–890 m; hasta ~1940 m en Cundinamarca [16,17].',
        ],
      },
      {
        k: 'tvap',
        titulo: 'Trialeurodes vaporariorum',
        sub: 'Mosca blanca de los invernaderos',
        puntos: [
          'Menos eficiente; retención 1 día [5].',
          'Altas densidades en invernaderos de clima medio y frío [2].',
          'Colombia: 600–2830 m [16,17].',
          'También vector del PYVV [18].',
        ],
      },
      {
        k: 'tabu',
        titulo: 'Trialeurodes abutilonea',
        sub: 'Mosca blanca de alas bandeadas',
        puntos: [
          'Muy eficiente; retención hasta 5 días [5].',
          'Estados Unidos y Cuba; sin registro en Colombia [9].',
        ],
      },
    ],
    eficiencia: {
      titulo: 'Eficiencia relativa de transmisión',
      texto: 'De mayor a menor [2,5,6]:',
      orden: ['B. tabaci MED', 'B. tabaci MEAM1 ≈ T. abutilonea', 'B. tabaci NW', 'T. vaporariorum'],
      retencion: [
        { vector: 'T. abutilonea', dias: 5, fuente: '[5]' },
        { vector: 'B. tabaci MED', dias: 4, texto: '> 4', fuente: '[6]' },
        { vector: 'B. tabaci MEAM1', dias: 2, fuente: '[5]' },
        { vector: 'B. tabaci NW', dias: 1, fuente: '[5]' },
        { vector: 'T. vaporariorum', dias: 1, fuente: '[5]' },
      ],
      retencionTitulo: 'Días de retención del virus en el vector',
    },
    epidemiologia: {
      titulo: 'Implicaciones epidemiológicas',
      items: [
        'Protocolo EPPO: 48 h de adquisición y 48 h de inoculación con T. vaporariorum [6,9].',
        'Las epidemias siguen oleadas de moscas virulíferas (dispersión primaria), como en Brasil [15].',
        'Los insecticidas lentos no evitan la inoculación; cuentan mallas y fuentes de inóculo [2,9].',
        'Dos vectores, dos pisos térmicos: B. tabaci abajo, T. vaporariorum arriba. En Costa Rica el reporte en pimentón ocurrió solo con T. vaporariorum [19].',
      ],
    },
  },

  mapa: {
    kicker: '03 · Distribución mundial',
    titulo: 'Del primer reporte en Florida a 41 países y territorios',
    lead: 'Presencia según la EPPO (28 de julio de 2026); año del primer reporte según Fiallo-Olivé y Navas-Castillo (2019) [2,9].',
    vistas: { mundo: 'Mundo', sudamerica: 'Sudamérica', colombia: 'Colombia' },
    leyenda: {
      titulo: 'Leyenda',
      presente: 'Presente (EPPO)',
      erradicado: 'Ausente: erradicado',
      sinRegistro: 'Sin reporte en las bases consultadas',
      anio: 'Número = año del primer reporte, cuando se conoce [2].',
    },
    colombia: {
      titulo: 'Colombia',
      texto: 'Sin registros en EPPO, en las revisiones de 2019 y 2023, ni en PubMed o GenBank al 19 de octubre de 2026 [2,9,20]. El crinivirus conocido en tomate colombiano es el PYVV, transmitido por T. vaporariorum [18,21].',
    },
    aviso: 'Lista en revisión: verificar cada país contra la fuente original. Círculos en el centroide aproximado del país.',
    fuentes: [
      'EPPO Global Database. Crinivirus tomatichlorosis (TOCV00): distribution. https://gd.eppo.int/taxon/TOCV00/distribution (actualizado 2026-07-28).',
      'Fiallo-Olivé E, Navas-Castillo J. 2019. Molecular Plant Pathology 20:1307–1320. Tabla 1 (años de primer reporte).',
    ],
    tablaTitulo: 'Países y territorios (EPPO, 2026-07-28)',
    columnas: ['País o territorio', 'Región', 'Estatus EPPO', 'Primer reporte [2]'],
  },

  red: {
    kicker: '04 · Red de transmisión',
    titulo: 'Una red de municipios conectados por el vuelo de las moscas blancas',
    lead: 'Nodo = municipio. Arista = movimientos simulados de moscas blancas (1000 réplicas, pasos de 6 km). Color = vector dominante. Haz clic en un nodo.',
    // Etiquetas provisionales de los atributos del vector. La definición exacta de los prefijos
    // "p", "c" y "s" está pendiente de confirmación con quien construyó la red: cambia aquí los
    // textos cuando se confirme (ver PENDIENTES_VERIFICACION.md).
    atributos: {
      pAdd: { corto: 'Índice combinado', largo: 'Índice combinado de moscas blancas (pAdd)', ayuda: 'Suma exacta de los índices de B. tabaci y T. vaporariorum (cBtab + cTvap). Definición pendiente de confirmación.' },
      cBtab: { corto: 'Índice B. tabaci', largo: 'Índice B. tabaci (cBtab)', ayuda: 'Componente de B. tabaci en el índice combinado. Definición pendiente de confirmación.' },
      cTvap: { corto: 'Índice T. vaporariorum', largo: 'Índice T. vaporariorum (cTvap)', ayuda: 'Componente de T. vaporariorum en el índice combinado. Definición pendiente de confirmación.' },
      sBtab: { corto: 'Proporción B. tabaci', largo: 'Proporción relativa de B. tabaci (sBtab)', ayuda: 'Peso relativo de B. tabaci frente a T. vaporariorum (en la mayoría de los municipios sBtab + sTvap = 1). Definición pendiente de confirmación.' },
      sTvap: { corto: 'Proporción T. vaporariorum', largo: 'Proporción relativa de T. vaporariorum (sTvap)', ayuda: 'Peso relativo de T. vaporariorum frente a B. tabaci. Definición pendiente de confirmación.' },
      tvapDominante: { corto: 'Vector dominante', largo: 'Vector dominante (Tvap_dominant)', ayuda: 'Vale 1 cuando la proporción de T. vaporariorum supera 0,5; coincide con la regla en los 1090 municipios.' },
      notaProvisional: 'Nombres provisionales: definición de los índices pendiente de confirmación.',
    },
    ui: {
      buscar: 'Buscar municipio…',
      sinResultados: 'Sin coincidencias',
      filtros: 'Filtros',
      departamento: 'Departamento',
      todos: 'Todos',
      vector: 'Vector dominante',
      vectorBtab: 'B. tabaci',
      vectorTvap: 'T. vaporariorum',
      cultivo: 'Cultivo de tomate',
      cultivoOpciones: { 0: 'Sin tomate registrado', 1: 'Campo abierto', 2: 'Invernadero', 3: 'Campo abierto e invernadero' },
      comunidad: 'Comunidad (Louvain)',
      colorPor: 'Color por',
      tamanoPor: 'Tamaño por',
      colorOpciones: {
        vector: 'Vector dominante (proporción)',
        indice: 'Índice combinado de moscas blancas',
        cultivo: 'Cultivo de tomate',
        comunidad: 'Comunidad Louvain',
        departamento: 'Departamento',
        betweenness: 'Intermediación',
        pagerank: 'PageRank',
      },
      tamanoOpciones: { area: 'Área de tomate (ha)', pagerank: 'PageRank', betweenness: 'Intermediación', grado: 'Grado (n.º de conexiones)', uniforme: 'Uniforme' },
      posicion: 'Posición de los nodos',
      posicionOpciones: { dane: 'Centroide municipal (DANE)', gexf: 'Posición original de la red (cabecera)' },
      aristas: 'Aristas visibles',
      umbral: 'Peso mínimo de arista',
      mostrarAristas: 'Mostrar aristas',
      soloTomate: 'Solo municipios con tomate',
      limpiar: 'Limpiar filtros',
      recentrar: 'Recentrar',
      acercar: 'Acercar',
      alejar: 'Alejar',
      cargando: 'Cargando red…',
      nodoTitulo: 'Municipio seleccionado',
      nodoAyuda: 'Pasa el cursor o haz clic sobre un nodo. Clic en el fondo para deseleccionar.',
      perfilVector: 'Perfil del vector',
      vecinos: 'Conexiones más fuertes',
      grado: 'Conexiones',
      bucle: 'Movimientos internos (bucle)',
      ranking: 'puesto',
      de: 'de',
      invernadero: 'Invernadero',
      campo: 'Campo abierto',
      ha: 'ha',
      stats: { municipios: 'Municipios', aristas: 'Aristas', tomateros: 'Con tomate', visibles: 'Visibles' },
      leyenda: 'Leyenda',
      descargar: 'Descargar red original (GEXF, 2,8 MB)',
      descargarJson: 'Descargar JSON del visor',
      tamanoLeyenda: 'Tamaño =',
      leyendaVector: { btab: 'Domina B. tabaci', mixto: 'Proporciones similares', tvap: 'Domina T. vaporariorum' },
      leyendaIndice: { bajo: 'Índice combinado bajo', alto: 'alto' },
      leyendaMetrica: { bajo: 'baja', alto: 'alta' },
      anilloTomate: 'Anillo blanco = municipio con cultivo de tomate',
    },
    comoLeer: {
      titulo: 'Cómo leer esta red',
      items: [
        'Nodo: municipio (código DANE) en su centroide oficial (MGN 2023); opción de posición original (cabecera).',
        'Arista: movimientos entre dos municipios; peso = número de movimientos. Los bucles internos (85 % del total) se muestran en el panel del nodo.',
        'Color: cian = domina T. vaporariorum (tierras altas); terracota = domina B. tabaci (tierras bajas).',
        'Índice combinado (pAdd): alto en tierras bajas (Chocó, Meta, Córdoba), bajo en páramos y altiplanos (El Cocuy, Vetas, Bogotá).',
        'Intermediación: máxima en el Magdalena Medio (Cimitarra, Yondó, Puerto Boyacá, Guaduas). PageRank: nodos que reciben y redistribuyen.',
        'Louvain: 18 comunidades, afines a los departamentos. Anillo blanco: municipio con tomate; T. vaporariorum domina en 458 de 485.',
      ],
    },
  },

  colombia: {
    kicker: '05 · Colombia',
    titulo: 'Situación en Colombia',
    lead: 'Sin reportes de ToCV en EPPO, revisiones internacionales, PubMed ni GenBank al 19 de octubre de 2026 [2,9,20]. Resultados de investigación: cuando se publiquen.',
    tarjetas: [
      { titulo: 'Vectores en todas las zonas tomateras', texto: 'T. vaporariorum: 600–2830 m. B. tabaci: costa Atlántica y tierras bajas, hasta ~1940 m en Cundinamarca [16,17].' },
      { titulo: 'Un crinivirus ya circula en tomate', texto: 'PYVV, transmitido por T. vaporariorum: secuenciado en Marinilla (Antioquia) y frecuente en semillas y plántulas del oriente antioqueño [18,21,22].' },
      { titulo: 'Vecinos con ToCV', texto: 'Brasil (2006), Uruguay (2012), Argentina (2023); Costa Rica (2011) y Panamá con ambos vectores en tomate [2,9,19,23].' },
      { titulo: 'Síntomas fáciles de confundir', texto: 'El amarillamiento se atribuye a nutrición u otros virus; sin vigilancia molecular pasa inadvertido [2,9].' },
    ],
    pendiente: {
      titulo: 'Resultados de investigación',
      texto: 'Se incorporarán una vez publicados en una revista revisada por pares.',
    },
  },

  datos: {
    kicker: '06 · Datos y referencias',
    titulo: 'Datos abiertos, código y bibliografía',
    lead: 'Archivos reutilizables citando la fuente.',
    archivos: [
      { nombre: 'Red de transmisión (GEXF original, NetworkX)', ruta: 'data/ToCV_red_municipios.gexf', desc: '1090 municipios, 9215 aristas (1090 bucles), 16 atributos de nodo.' },
      { nombre: 'Red compacta para el visor (JSON)', ruta: 'data/red_tocv.json', desc: 'Centroides DANE, posición original, atributos del vector, tomate, centralidades y comunidades.' },
      { nombre: 'Lista de países EPPO (JSON, pendiente de verificación)', ruta: 'data/eppo_paises_pendiente_verificacion.json', desc: 'Transcrita de gd.eppo.int el 2026-10-19.' },
      { nombre: 'Figura del genoma (SVG)', ruta: 'figuras/genoma_tocv.svg', desc: 'Original, a escala; reutilizable citando el sitio.' },
    ],
    metodologia: {
      titulo: 'Cómo se construyó la red',
      items: [
        'Nodos: municipios (código DANE) en el centroide ponderado por área de la capa MGN_ADM_MPIO_GRAFICO, MGN 2023 [24].',
        'Aristas: modelo de dispersión de moscas blancas, 1000 réplicas, pasos de 6 km; peso = movimientos; distancia = 1/peso.',
        'Intermediación, PageRank y Louvain con NetworkX 3.2.1 sobre la red dirigida.',
        'Hectáreas de tomate (invernadero y campo) e índices de cada mosca blanca por municipio; documentación de los índices en preparación.',
      ],
    },
    referenciasTitulo: 'Referencias',
    referencias: [
      { n: 1, texto: 'Wisler GC, Li RH, Liu HY, Lowry DS, Duffus JE. 1998. Tomato chlorosis virus: a new whitefly-transmitted, phloem-limited, bipartite closterovirus of tomato. Phytopathology 88(5):402–409.', url: 'https://doi.org/10.1094/PHYTO.1998.88.5.402' },
      { n: 2, texto: 'Fiallo-Olivé E, Navas-Castillo J. 2019. Tomato chlorosis virus, an emergent plant virus still expanding its geographical and host ranges. Molecular Plant Pathology 20(9):1307–1320.', url: 'https://doi.org/10.1111/mpp.12847' },
      { n: 3, texto: 'Wintermantel WM, Wisler GC, Anchieta AG, Liu HY, Karasev AV, Tzanetakis IE. 2005. The complete nucleotide sequence and genome organization of Tomato chlorosis virus. Archives of Virology 150(11):2287–2298.', url: 'https://doi.org/10.1007/s00705-005-0571-4' },
      { n: 4, texto: 'Lozano G, Moriones E, Navas-Castillo J. 2006. Complete nucleotide sequence of the RNA2 of the crinivirus Tomato chlorosis virus. Archives of Virology 151(3):581–587.', url: 'https://doi.org/10.1007/s00705-005-0690-y' },
      { n: 5, texto: 'Wintermantel WM, Wisler GC. 2006. Vector specificity, host range, and genetic diversity of Tomato chlorosis virus. Plant Disease 90(6):814–819.', url: 'https://doi.org/10.1094/PD-90-0814' },
      { n: 6, texto: 'Shi X, Tang X, Zhang X, Zhang D, Li F, Yan F, Zhang Y, Zhou X, Liu Y. 2018. Transmission efficiency, preference and behavior of Bemisia tabaci MEAM1 and MED under the influence of Tomato chlorosis virus. Frontiers in Plant Science 8:2271.', url: 'https://doi.org/10.3389/fpls.2017.02271' },
      { n: 7, texto: 'Fiallo-Olivé E, Navas-Castillo J. 2023. Tomato chlorosis virus, a promiscuous virus with multiple host plants and whitefly vectors. Annals of Applied Biology 182(1):29–36.', url: 'https://doi.org/10.1111/aab.12809' },
      { n: 8, texto: 'NCBI Taxonomy. Crinivirus tomatichlorosis, TaxID 3428120. Consultado el 2026-10-19.', url: 'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=3428120' },
      { n: 9, texto: 'EPPO. 2026. Crinivirus tomatichlorosis (TOCV00). EPPO Global Database: datasheet (revisada 2021-07-09), hosts y distribution (actualizada 2026-07-28). Consultado el 2026-10-19.', url: 'https://gd.eppo.int/taxon/TOCV00' },
      { n: 10, texto: 'Mansilla-Córdova PJ, Bampi D, Rondinel-Mendoza NV, Melo PCT, Lourenção AL, Rezende JAM. 2018. Screening tomato genotypes for resistance and tolerance to Tomato chlorosis virus. Plant Pathology 67(9):1964–1972.', url: 'https://doi.org/10.1111/ppa.12826' },
      { n: 11, texto: 'Jacquemond M, Verdin E, Dalmon A, Guilbaud L, Gognalons P. 2009. Serological and molecular detection of Tomato chlorosis virus and Tomato infectious chlorosis virus in tomato. Plant Pathology 58(2):210–220.', url: 'https://doi.org/10.1111/j.1365-3059.2008.01959.x' },
      { n: 12, texto: 'Fortes IM, Navas-Castillo J. 2012. Potato, an experimental and natural host of the crinivirus Tomato chlorosis virus. European Journal of Plant Pathology 134:81–86.', url: 'https://doi.org/10.1007/s10658-012-0025-2' },
      { n: 13, texto: 'Orfanidou CG, Pappi PG, Efthimiou KE, Katis NI, Maliogka VI. 2016. Transmission of Tomato chlorosis virus (ToCV) by Bemisia tabaci biotype Q and evaluation of four weed species as viral sources. Plant Disease 100(10):2043–2049.', url: 'https://doi.org/10.1094/PDIS-01-16-0054-RE' },
      { n: 14, texto: 'Fariña AE, Rezende JAM, Wintermantel WM. 2019. Expanding knowledge of the host range of Tomato chlorosis virus and host plant preference of Bemisia tabaci MEAM1. Plant Disease 103(7):1568–1578.', url: 'https://doi.org/10.1094/PDIS-11-18-1941-RE' },
      { n: 15, texto: 'Macedo MA, Inoue-Nagata AK, Silva TNZ, Freitas DMS, Rezende JAM, Michereff Filho M, Nascimento AR, Lourenção AL, Bergamin Filho A. 2019. Temporal and spatial progress of the diseases caused by the crinivirus tomato chlorosis virus and the begomovirus tomato severe rugose virus in tomatoes in Brazil. Plant Pathology 68(1):72–84.', url: 'https://doi.org/10.1111/ppa.12920' },
      { n: 16, texto: 'Quintero C, Rendón F, García J, Cardona C, López-Ávila A, Hernández MP. 2001. Especies y biotipos de moscas blancas (Homoptera: Aleyrodidae) en cultivos semestrales de Colombia y Ecuador. Revista Colombiana de Entomología 27(1-2):27–31.', url: 'https://hdl.handle.net/10568/44303' },
      { n: 17, texto: 'Ángel JE, Martínez J, Santamaría M, Parada S, Ebratt E. 2016. Identificación y distribución de moscas blancas (Hemiptera: Aleyrodidae) en cultivos de tomate en Cundinamarca (Colombia). Agronomía Colombiana 34(1):42–50.', url: 'https://doi.org/10.15446/agron.colomb.v34n1.51077' },
      { n: 18, texto: 'Salazar LF, Müller G, Querci M, Zapata JL, Owens RA. 2000. Potato yellow vein virus: its host range, distribution in South America and identification as a crinivirus transmitted by Trialeurodes vaporariorum. Annals of Applied Biology 137(1):7–19.', url: 'https://doi.org/10.1111/j.1744-7348.2000.tb00052.x' },
      { n: 19, texto: 'Vargas JA, Hammond R, Hernández E, Barboza N, Mora F, Ramírez P. 2011. First report of Tomato chlorosis virus infecting sweet pepper in Costa Rica. Plant Disease 95(11):1482.', url: 'https://doi.org/10.1094/PDIS-05-11-0381' },
      { n: 20, texto: 'Búsquedas en PubMed ("tomato chlorosis virus" AND Colombia) y GenBank (Tomato chlorosis virus[Organism] AND Colombia) realizadas el 2026-10-19: sin resultados.', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=%22tomato+chlorosis+virus%22+AND+Colombia' },
      { n: 21, texto: 'Muñoz-Baena L, Gutiérrez-Sánchez PA, Marín-Montoya M. 2017. Secuenciación del genoma completo del Potato yellow vein virus (PYVV) en tomate (Solanum lycopersicum) en Colombia. Acta Biológica Colombiana 22(1):5–17.', url: 'https://doi.org/10.15446/abc.v22n1.59211' },
      { n: 22, texto: 'Gallo-García Y, Muñoz-Baena L, Toro-Fernández LF, Gutiérrez-Sánchez PA, Marín-Montoya M. 2020. Identificación de virus de RNA en cultivos de tomate del oriente de Antioquia (Colombia) por NGS. Bioagro 32(3):147–158.', url: 'https://revistas.uclave.org/index.php/bioagro/article/view/2757' },
      { n: 23, texto: 'González GI, Pitti J, Gutiérrez A, Santamaría-Guerra J. 2023. Ocurrencia y distribución de Bemisia tabaci y Trialeurodes vaporariorum (Hemiptera: Aleyrodidae) en cultivos de tomate en Panamá. Acta Agronómica 72(1):43–52.', url: 'https://doi.org/10.15446/acta_agron.v72n1.96974' },
      { n: 24, texto: 'DANE. 2023. Marco Geoestadístico Nacional (MGN 2023), capa MGN_ADM_MPIO_GRAFICO. Geoportal DANE.', url: 'https://geoportal.dane.gov.co/' },
      { n: 25, texto: 'GenBank NC_007340.1. Tomato chlorosis virus segment RNA 1, complete sequence (8595 nt). RefSeq, consultado el 2026-10-19.', url: 'https://www.ncbi.nlm.nih.gov/nuccore/NC_007340.1' },
      { n: 26, texto: 'GenBank NC_007341.1. Tomato chlorosis virus RNA 2, complete genome (8247 nt). RefSeq, consultado el 2026-10-19.', url: 'https://www.ncbi.nlm.nih.gov/nuccore/NC_007341.1' },
    ],
  },

  pie: {
    texto: 'Universidad Nacional de Colombia, Sede Medellín · Grupo de Investigación Biotecnología Microbiana. Contenido basado en literatura revisada por pares y bases oficiales (EPPO, ICTV/NCBI, GenBank, DANE); la red de transmisión es del grupo de investigación.',
    nota: 'Mapa base: Esri World Dark Gray. Visualización con sigma.js, graphology y Leaflet.',
    repo: 'Código fuente en GitHub',
    repoUrl: 'https://github.com/biotecnologiamicrobianaunalmed/ToCVResearch_sayaj',
    hermano: 'Sitio hermano: ToBRFV en Colombia',
    hermanoUrl: 'https://biotecnologiamicrobianaunalmed.github.io/ToBRFVResearch_sayaj/',
  },
};

export default es;
