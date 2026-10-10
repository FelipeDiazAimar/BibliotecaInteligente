// Helper central del modo demo del backend.
// DEMO_MODE default true si la variable está ausente: cualquier valor distinto de
// 'false'/'0'/'no'/'off' (insensible a mayúsculas) activa el modo demo.
// En modo real (DEMO_MODE=false) este módulo no altera ningún comportamiento:
// solo expone datos de ejemplo y el aviso [demo] para los stubs.

require('dotenv').config();

function isDemoMode() {
  const raw = process.env.DEMO_MODE;
  if (raw === undefined || raw === null || String(raw).trim() === '') return true;
  return !['false', '0', 'no', 'off'].includes(String(raw).trim().toLowerCase());
}

const DEMO_TAG = '[demo]';

// Libros de ejemplo para el modo demo (coinciden con los campos del modelo Libro).
// Se usan como fallback de lectura cuando no hay DB y como fuente del seed idempotente.
const DEMO_BOOKS = [
  {
    id: 1,
    nroInventario: 'DEMO-001',
    biblioteca: 'Biblioteca Central (demo)',
    signaturaTopografica: '863 C3',
    titulo: 'Don Quijote de la Mancha',
    subtitulo: '',
    autor: 'Miguel de Cervantes',
    editorial: 'Demo Editorial',
    edicion: '1ra',
    lugar: 'Madrid',
    anioPublicacion: 1605,
    paginas: 863,
    isbn: '978-0-00-000001-1',
    serie: '',
    fechaIngreso: '2024-01-01',
    observaciones: 'Libro de ejemplo (demo)',
    idioma: 'Español',
    diasPrestamo: '7',
    disponible: true
  },
  {
    id: 2,
    nroInventario: 'DEMO-002',
    biblioteca: 'Biblioteca Central (demo)',
    signaturaTopografica: '863 G2',
    titulo: 'Cien años de soledad',
    subtitulo: '',
    autor: 'Gabriel García Márquez',
    editorial: 'Demo Editorial',
    edicion: '1ra',
    lugar: 'Buenos Aires',
    anioPublicacion: 1967,
    paginas: 471,
    isbn: '978-0-00-000002-8',
    serie: '',
    fechaIngreso: '2024-01-02',
    observaciones: 'Libro de ejemplo (demo)',
    idioma: 'Español',
    diasPrestamo: '7',
    disponible: true
  },
  {
    id: 3,
    nroInventario: 'DEMO-003',
    biblioteca: 'Biblioteca Central (demo)',
    signaturaTopografica: '863 A4',
    titulo: 'La casa de los espíritus',
    subtitulo: '',
    autor: 'Isabel Allende',
    editorial: 'Demo Editorial',
    edicion: '1ra',
    lugar: 'Santiago',
    anioPublicacion: 1982,
    paginas: 433,
    isbn: '978-0-00-000003-5',
    serie: '',
    fechaIngreso: '2024-01-03',
    observaciones: 'Libro de ejemplo (demo)',
    idioma: 'Español',
    diasPrestamo: '7',
    disponible: true
  },
  {
    id: 4,
    nroInventario: 'DEMO-004',
    biblioteca: 'Biblioteca Central (demo)',
    signaturaTopografica: '843 S1',
    titulo: 'El principito',
    subtitulo: '',
    autor: 'Antoine de Saint-Exupéry',
    editorial: 'Demo Editorial',
    edicion: '1ra',
    lugar: 'París',
    anioPublicacion: 1943,
    paginas: 96,
    isbn: '978-0-00-000004-2',
    serie: '',
    fechaIngreso: '2024-01-04',
    observaciones: 'Libro de ejemplo (demo)',
    idioma: 'Español',
    diasPrestamo: '7',
    disponible: true
  },
  {
    id: 5,
    nroInventario: 'DEMO-005',
    biblioteca: 'Biblioteca Central (demo)',
    signaturaTopografica: '863 C8',
    titulo: 'Rayuela',
    subtitulo: '',
    autor: 'Julio Cortázar',
    editorial: 'Demo Editorial',
    edicion: '1ra',
    lugar: 'Buenos Aires',
    anioPublicacion: 1963,
    paginas: 635,
    isbn: '978-0-00-000005-9',
    serie: '',
    fechaIngreso: '2024-01-05',
    observaciones: 'Libro de ejemplo (demo)',
    idioma: 'Español',
    diasPrestamo: '7',
    disponible: false
  }
];

// Devuelve el secreto JWT. En modo demo, si falta JWT_SECRET se usa un secreto
// de desarrollo (con aviso por consola); en modo real devuelve null para que el
// llamador responda 500 con un mensaje claro en lugar de firmar con undefined.
function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (isDemoMode()) {
    console.warn(`${DEMO_TAG} JWT_SECRET ausente: usando secreto temporal solo para demo.`);
    return 'demo-secret-solo-desarrollo-no-usar-en-produccion';
  }
  return null;
}

module.exports = { isDemoMode, DEMO_TAG, DEMO_BOOKS, getJwtSecret };
