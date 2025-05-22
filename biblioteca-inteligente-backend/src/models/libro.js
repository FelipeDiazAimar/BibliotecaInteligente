// Modelo que representa un libro en la base de datos.
// Define qué datos tiene un libro y sus tipos.

module.exports = (sequelize, DataTypes) => {
  const Libro = sequelize.define('Libro', {
    nroInventario: DataTypes.STRING,           // Nro Inventario
    biblioteca: DataTypes.STRING,              // Biblioteca
    signaturaTopografica: DataTypes.STRING,    // Signatura Topográfica
    titulo: DataTypes.STRING,                  // Título
    subtitulo: DataTypes.STRING,               // SubTítulo
    autor: DataTypes.STRING,                   // Autores
    editorial: DataTypes.STRING,               // Editorial
    edicion: DataTypes.STRING,                 // Edición
    lugar: DataTypes.STRING,                   // Lugar
    anioPublicacion: DataTypes.INTEGER,        // Año
    paginas: DataTypes.INTEGER,                // Páginas
    isbn: DataTypes.STRING,                    // ISBN
    serie: DataTypes.STRING,                   // Serie
    fechaIngreso: DataTypes.STRING,            // Fecha de Ingreso (puedes usar DATE si prefieres)
    observaciones: DataTypes.STRING,           // Observaciones
    idioma: DataTypes.STRING,                  // Idioma
    diasPrestamo: DataTypes.STRING,            // Días Préstamo
    portada: DataTypes.BLOB('long'),           // Imagen de portada (BLOB)
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Libro;
};