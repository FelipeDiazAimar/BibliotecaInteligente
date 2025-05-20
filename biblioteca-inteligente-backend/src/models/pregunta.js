// Modelo que representa una pregunta realizada (puede usarse para IA o historial).

module.exports = (sequelize, DataTypes) => {
  const Pregunta = sequelize.define('Pregunta', {
    texto: DataTypes.TEXT, // El texto de la pregunta
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return Pregunta;
};