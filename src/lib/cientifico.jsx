// Nombres científicos en cursiva según el ICTV y la nomenclatura binomial.
// Van en cursiva: especie, género y familia de virus (Crinivirus tomatichlorosis, Crinivirus,
// Closteroviridae) y los binomios de plantas e insectos (Solanum lycopersicum, Bemisia tabaci...).
// NO van en cursiva el nombre común del virus (tomato chlorosis virus) ni la sigla ToCV.
// Uso: <T>{texto}</T> en cualquier cadena visible. Las marcas [n] se convierten en superíndices
// con enlace a la referencia n de la sección de referencias.
import React from 'react';

const NOMBRES = [
  // binomios primero, para que ganen sobre el género solo
  'Crinivirus tomatichlorosis',
  'Crinivirus contagichlorosis',
  'Solanum lycopersicum',
  'Solanum tuberosum',
  'Solanum melongena',
  'Solanum nigrum',
  'Solanum americanum',
  'Capsicum annuum',
  'Physalis peruviana',
  'Physalis angulata',
  'Nicandra physalodes',
  'Nicandra physaloides',
  'Amaranthus retroflexus',
  'Sonchus oleraceus',
  'Chenopodium album',
  'Datura stramonium',
  'Bemisia tabaci',
  'Trialeurodes vaporariorum',
  'Trialeurodes abutilonea',
  'Nicotiana benthamiana',
  'Encarsia formosa',
  // abreviaturas de género
  'B\\. tabaci',
  'T\\. vaporariorum',
  'T\\. abutilonea',
  'S\\. lycopersicum',
  'C\\. annuum',
  'S\\. tuberosum',
  // familias y órdenes de virus
  'Closteroviridae',
  'Martellivirales',
  'Geminiviridae',
  'Secoviridae',
  'Potyviridae',
  'Virgaviridae',
  // familias de plantas
  'Solanaceae',
  // géneros (solo con mayúscula inicial; "crinivirus" en minúscula es nombre común)
  'Crinivirus',
  'Closterovirus',
  'Begomovirus',
  'Tobamovirus',
  'Solanum',
  'Capsicum',
  'Bemisia',
  'Trialeurodes',
  'Physalis',
];

const PATRON = new RegExp(`(\\[(\\d+(?:,\\s*\\d+)*)\\])|\\b(${NOMBRES.join('|')})\\b`, 'g');

export function cursiva(texto) {
  if (typeof texto !== 'string' || !PATRON.test(texto)) return texto;
  PATRON.lastIndex = 0;
  const partes = [];
  let ultimo = 0;
  let m;
  let k = 0;
  while ((m = PATRON.exec(texto)) !== null) {
    if (m.index > ultimo) partes.push(texto.slice(ultimo, m.index));
    if (m[1]) {
      const nums = m[2].split(',').map((s) => s.trim());
      partes.push(
        <sup className="cita" key={k++}>
          [{nums.map((n, i) => (
            <React.Fragment key={n}>
              {i > 0 && ','}
              <a href={`#ref-${n}`} title={`Referencia ${n}`}>{n}</a>
            </React.Fragment>
          ))}]
        </sup>
      );
    } else {
      partes.push(<i className="sci" key={k++}>{m[3]}</i>);
    }
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}

export function T({ children }) {
  if (Array.isArray(children)) {
    return <>{children.map((c, i) => <React.Fragment key={i}>{cursiva(c)}</React.Fragment>)}</>;
  }
  return <>{cursiva(children)}</>;
}

export default T;
