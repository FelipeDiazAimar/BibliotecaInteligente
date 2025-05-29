// Modelo que representa un prompt (mensaje enviado a la IA).

module.exports = (sequelize, DataTypes) => {
  const Prompt = sequelize.define('Prompt', {
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Prompt.associate = function(models) {
    Prompt.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    Prompt.hasOne(models.Respuesta, { foreignKey: 'promptId' });
  };

  return Prompt;
};