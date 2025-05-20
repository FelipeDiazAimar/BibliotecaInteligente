// Modelo que representa una respuesta (puede usarse para IA o historial).

module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define('Respuesta', {
    texto: DataTypes.TEXT, // El texto de la respuesta
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return Respuesta;
};