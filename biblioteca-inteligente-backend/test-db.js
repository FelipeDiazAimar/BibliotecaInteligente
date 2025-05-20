// Este archivo sirve para probar la conexión a la base de datos y sincronizar los modelos.
// Útil para asegurarte de que todo está bien configurado.

const { sequelize } = require('./models');
const { body } = require('express-validator');
const libroController = require('./controllers/libroController');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente!');
    
    // Sincronizar modelos (crea las tablas si no existen)
    await sequelize.sync({ force: true }); // force: true solo en desarrollo!
    console.log('✅ Modelos sincronizados correctamente!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();

// El siguiente código no es necesario aquí, solo sirve en archivos de rutas.
// router.post('/', ...);