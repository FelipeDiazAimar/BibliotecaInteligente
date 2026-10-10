// Respuestas simuladas del asistente IA para el Modo Demo.
//
// Contrato:
// - `respuestasDemo`: 6+ pares { patrones, respuesta, sugeridos }.
// - `buscarRespuestaDemo(pregunta)`: matchea por keywords (minusculas,
//   insensible a tildes) y devuelve { respuesta, sugeridos } con fallback amable.
//
// Los ids de `sugeridos` corresponden al dataset del modo demo
// (`src/data/demoLibros.js`: ids numéricos 1..12, con materia entre sus campos).

export const respuestasDemo = [
  {
    id: 'saludo',
    patrones: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'como estas', 'saludos'],
    respuesta:
      '¡Hola! Soy el asistente demo de la Biblioteca Inteligente. Puedo recomendarte libros de física, matemática, literatura, historia, programación o química. ¿Qué te gustaría leer hoy?',
    sugeridos: [5, 1],
  },
  {
    id: 'fisica',
    patrones: ['fisica', 'fisica 2', 'cinematica', 'dinamica', 'newton', 'termodinamica', 'electromagnetismo', 'mecanica', 'optica'],
    respuesta:
      'Para física te sugiero estos títulos del catálogo demo: ideales para Física 2 (cinemática, dinámica y electromagnetismo). Tocá una sugerencia para ver el detalle del libro.',
    sugeridos: [5, 1],
  },
  {
    id: 'matematica',
    patrones: ['matematica', 'algebra', 'calculo', 'analisis matematico', 'geometria', 'estadistica', 'derivada', 'integral', 'funciones'],
    respuesta:
      'Para matemática te recomiendo estos títulos del catálogo demo: cubren álgebra, cálculo y geometría, perfectos para practicar con ejercicios.',
    sugeridos: [1, 9],
  },
  {
    id: 'literatura',
    patrones: ['literatura', 'novela', 'cuento', 'poesia', 'ficcion', 'lectura', 'leer por placer', 'borges', 'cortazar'],
    respuesta:
      'Si buscás literatura, estos títulos demo son una gran puerta de entrada: novelas y cuentos para leer por placer. Elegí uno para ver su detalle.',
    sugeridos: [10, 2],
  },
  {
    id: 'historia',
    patrones: ['historia', 'historia argentina', 'san martin', 'revolucion de mayo', 'siglo xx', 'edad media', 'independencia'],
    respuesta:
      'Para historia te sugiero estos títulos del catálogo demo: recorren la historia argentina y mundial con un lenguaje claro para estudiantes.',
    sugeridos: [3, 12],
  },
  {
    id: 'programacion',
    patrones: ['programacion', 'informatica', 'computacion', 'javascript', 'python', 'codigo', 'software', 'algoritmo', 'programar'],
    respuesta:
      'Para programación e informática te recomiendo estos títulos demo: parten desde cero y llegan hasta algoritmos y buenas prácticas.',
    sugeridos: [7, 11],
  },
  {
    id: 'quimica',
    patrones: ['quimica', 'tabla periodica', 'atomo', 'molecula', 'laboratorio', 'reacciones'],
    respuesta:
      'Para química estos títulos demo te van a servir: tabla periódica, átomos y reacciones explicados paso a paso.',
    sugeridos: [6, 4],
  },
  {
    id: 'recomendacion-general',
    patrones: ['recomenda', 'recomendacion', 'sugeri', 'sugerencia', 'que libro', 'cual leo', 'no se que leer', 'que leo'],
    respuesta:
      'Con gusto (modo demo). Contame una materia —física, matemática, literatura, historia, programación o química— y te sugiero títulos del catálogo. Mientras tanto, acá van algunos destacados:',
    sugeridos: [1, 5, 7],
  },
  {
    id: 'prestamo',
    patrones: ['prestamo', 'prestar', 'reserva', 'reservar', 'disponible', 'disponibilidad', 'horario', 'devolver', 'devolucion', 'retirar', 'biblioteca'],
    respuesta:
      'En la demo los préstamos son simulados: podés pedir hasta 3 libros por 7 días desde el Catálogo, y retirar en el horario de la biblioteca. Estos títulos demo figuran como disponibles:',
    sugeridos: [5, 1],
  },
  {
    id: 'despedida',
    patrones: ['gracias', 'chau', 'adios', 'nos vemos', 'hasta luego', 'genial', 'perfecto', 'buenisimo'],
    respuesta: '¡De nada! Que disfrutes la lectura. Si necesitás otra recomendación, acá estoy.',
    sugeridos: [],
  },
];

const FALLBACK_DEMO = {
  respuesta:
    'En el modo demo puedo ayudarte con recomendaciones de física, matemática, literatura, historia, programación o química, además de info sobre préstamos. Probá preguntarme, por ejemplo: "¿Qué libros de física me recomendás?"',
  sugeridos: [1, 5, 7],
};

const ENE_PLACEHOLDER = '%%ENE%%';

/** Normaliza texto para el matcheo: minusculas, sin tildes (conserva la enie), sin signos. */
export function normalizarTexto(texto) {
  return (texto ?? '')
    .toString()
    .toLowerCase()
    .split('ñ')
    .join(ENE_PLACEHOLDER)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(ENE_PLACEHOLDER)
    .join('ñ')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Busca la mejor respuesta demo para una pregunta.
 * @param {string} pregunta texto libre del usuario
 * @returns {{ respuesta: string, sugeridos: number[] }} respuesta + ids de libros demo
 */
export function buscarRespuestaDemo(pregunta) {
  const limpio = normalizarTexto(pregunta);
  if (!limpio) {
    return { respuesta: 'Escribí tu pregunta y te respondo en el acto (modo demo).', sugeridos: [] };
  }
  let mejor = null;
  let mejorPuntaje = 0;
  for (const item of respuestasDemo) {
    let puntaje = 0;
    for (const patron of item.patrones || []) {
      const p = normalizarTexto(patron);
      if (p && limpio.includes(p)) puntaje += p.includes(' ') ? 2 : 1;
    }
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = item;
    }
  }
  if (!mejor || mejorPuntaje === 0) {
    return { respuesta: FALLBACK_DEMO.respuesta, sugeridos: [...FALLBACK_DEMO.sugeridos] };
  }
  return { respuesta: mejor.respuesta, sugeridos: [...(mejor.sugeridos || [])] };
}
