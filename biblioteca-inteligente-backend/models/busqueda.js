// Modelo que representa una búsqueda realizada por un usuario.

module.exports = (sequelize, DataTypes) => {
  const Busqueda = sequelize.define('Busqueda', {
    termino: DataTypes.STRING, // Qué buscó el usuario
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Relaciona la búsqueda con el usuario que la hizo
  Busqueda.associate = function(models) {
    Busqueda.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };

  return Busqueda;
};