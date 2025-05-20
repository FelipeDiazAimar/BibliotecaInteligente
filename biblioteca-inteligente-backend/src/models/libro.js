// Modelo que representa un libro en la base de datos.
// Define qué datos tiene un libro y sus tipos.

module.exports = (sequelize, DataTypes) => {
  const Libro = sequelize.define('Libro', {
    titulo: DataTypes.STRING,           // Título del libro
    autor: DataTypes.STRING,            // Autor del libro
    anioPublicacion: DataTypes.INTEGER, // Año en que se publicó
    materia: DataTypes.STRING,          // Materia o tema (opcional)
    disponible: {                       // Si el libro está disponible o no
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Libro;
};