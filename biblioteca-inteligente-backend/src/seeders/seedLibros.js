// Este archivo sirve para cargar libros de ejemplo en la base de datos automáticamente.
// Es útil para tener datos de prueba y no tener que cargar libros uno por uno a mano.

const { Libro } = require('../models');

module.exports = {
  // Esta función agrega libros de ejemplo
  up: async () => {
    await Libro.bulkCreate([
      { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anioPublicacion: 1967 },
      { titulo: 'Rayuela', autor: 'Julio Cortázar', anioPublicacion: 1963 }
      // Puedes agregar más libros aquí
    ]);
  },
  // Esta función borra todos los libros (útil para limpiar la base de datos)
  down: async () => {
    await Libro.destroy({ where: {} });
  }
};