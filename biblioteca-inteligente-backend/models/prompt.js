// Modelo que representa un prompt (mensaje enviado a la IA).

module.exports = (sequelize, DataTypes) => {
  const Prompt = sequelize.define('Prompt', {
    texto: DataTypes.TEXT, // El texto enviado a la IA
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Relaciona el prompt con el usuario que lo envió
  Prompt.associate = function(models) {
    Prompt.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };

  return Prompt;
};