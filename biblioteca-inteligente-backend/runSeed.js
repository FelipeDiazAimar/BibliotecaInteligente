// Este archivo ejecuta el seeder para cargar los libros de ejemplo en la base de datos.
// Borra los libros anteriores y carga los nuevos que están en seedLibros.js.

const { sequelize, Libro } = require('./models');
const seedLibros = require('./seeders/seedLibros');

async function run() {
  try {
    await sequelize.sync({ force: false }); // Asegura que la tabla existe
    await Libro.destroy({ where: {} }); // Borra todos los libros antes de cargar
    await seedLibros.up(); // Carga los libros de ejemplo
    console.log('✅ Libros cargados correctamente en la base de datos.');
  } catch (error) {
    console.error('❌ Error al cargar libros:', error);
  } finally {
    await sequelize.close();
  }
}

run();