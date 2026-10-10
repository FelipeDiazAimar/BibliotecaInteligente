// Seed demo idempotente: carga los libros de ejemplo SIN borrar nada.
// - NUNCA usa destroy/drop/force:true: usa findOrCreate por ISBN (o título+autor
//   si no hay ISBN), por lo que puede correrse varias veces sin duplicar ni
//   perder datos reales.
// - En DEMO_MODE imprime el aviso [demo]; con DEMO_MODE=false carga los mismos
//   datos de ejemplo pero sin el aviso (modo real intacto).
// Uso: node runSeed.js  (desde biblioteca-inteligente-backend/, ver .env.example)

require('dotenv').config();

const { sequelize, Libro } = require('./src/models');
const { isDemoMode, DEMO_TAG, DEMO_BOOKS } = require('./src/config/demo');

async function run() {
  const demo = isDemoMode();
  console.log(demo ? `${DEMO_TAG} seed demo: carga idempotente (no borra datos).` : 'Seed: carga idempotente (no borra datos).');
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sin force: solo crea tablas faltantes, no borra nada.

    let creados = 0;
    let existentes = 0;
    for (const libro of DEMO_BOOKS) {
      // Clave de idempotencia: ISBN si existe, si no título+autor.
      const where = libro.isbn ? { isbn: libro.isbn } : { titulo: libro.titulo, autor: libro.autor };
      const data = { ...libro };
      delete data.id; // Deja que la DB asigne el id (evita choques de secuencia).
      delete data.portada; // Las portadas demo no incluyen binarios.
      const [, created] = await Libro.findOrCreate({ where, defaults: data });
      if (created) creados += 1;
      else existentes += 1;
    }
    console.log(`✅ Seed completo: ${creados} creados, ${existentes} ya existían. Total ejemplo: ${DEMO_BOOKS.length}.`);
  } catch (error) {
    console.error('❌ Error al cargar libros:', error.message);
    console.error('Verifique que Postgres esté en ejecución y revise DATABASE_URL o DB_* en .env (ver .env.example).');
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
