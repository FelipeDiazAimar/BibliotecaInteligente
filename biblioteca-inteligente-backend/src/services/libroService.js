// Este archivo es un "servicio" para buscar libros por título en la base de datos.
// Se puede usar desde los controladores para separar la lógica de búsqueda.

const { Libro } = require('../models');
const { Sequelize } = require('sequelize');

class LibroService {
  // Busca libros cuyo título contenga el texto recibido
  async buscarPorTitulo(titulo) {
    return await Libro.findAll({
      where: {
        titulo: {
          [Sequelize.Op.like]: `%${titulo}%`
        }
      }
    });
  }
}

module.exports = new LibroService();