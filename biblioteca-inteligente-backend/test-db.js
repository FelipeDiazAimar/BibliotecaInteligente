// Diagnóstico de conexión a la base de datos (solo lectura, no modifica nada).
// - Conecta con authenticate() y cuenta libros/usuarios si las tablas existen.
// - NUNCA usa sync({ force: true }) ni drop: es seguro correrlo en cualquier entorno.
// - En DEMO_MODE sin DB informa que /api/health y los stubs siguen funcionando.
// Uso: node test-db.js  (desde biblioteca-inteligente-backend/, ver .env.example)

require('dotenv').config();

const { sequelize, Libro, Usuario } = require('./src/models');
const { isDemoMode, DEMO_TAG } = require('./src/config/demo');

async function testConnection() {
  const demo = isDemoMode();
  console.log(`DEMO_MODE=${demo}`);
  console.log(`DB: host=${process.env.DB_HOST || 'localhost'} puerto=${process.env.DB_PORT || 5432} ` +
    `db=${process.env.DATABASE_URL ? '(DATABASE_URL)' : (process.env.DB_NAME || 'biblioteca_dev')} ` +
    `usuario=${process.env.DB_USER || 'postgres'}`);

  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    try {
      const [libros, usuarios] = await Promise.all([Libro.count(), Usuario.count()]);
      console.log(`✅ Tablas OK: ${libros} libro(s), ${usuarios} usuario(s).`);
    } catch (countError) {
      console.log('⚠️ Conectó, pero alguna tabla aún no existe:', countError.message);
      console.log('Corra el servidor (node server.js) para sincronizar, o el seed: node runSeed.js');
    }
  } catch (error) {
    console.error('❌ Sin conexión a la base de datos:', error.message);
    if (demo) {
      console.log(`${DEMO_TAG} sin Postgres igual responden: GET /api/health, GET /api/libros (ejemplo) y POST /api/asistente/ask (stub).`);
    } else {
      console.log('Revise DATABASE_URL o las variables DB_* en el archivo .env (ver .env.example).');
    }
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

testConnection();
