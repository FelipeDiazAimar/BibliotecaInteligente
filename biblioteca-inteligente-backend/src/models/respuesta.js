// Modelo que representa una respuesta (puede usarse para IA o historial).

module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define('Respuesta', {
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Respuesta.associate = function(models) {
    Respuesta.belongsTo(models.Prompt, { foreignKey: 'promptId' });
    Respuesta.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };

  return Respuesta;
};