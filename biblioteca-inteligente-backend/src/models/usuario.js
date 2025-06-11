// Modelo que representa un usuario (estudiante, profesor o admin) en la base de datos.

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    },
    password: DataTypes.STRING, // Se guarda encriptada
    rol: {
      type: DataTypes.ENUM('usuario', 'admin'),
      defaultValue: 'usuario'
    },
  }, {
    // Antes de guardar el usuario, encripta la contraseña
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  // Relaciona usuario con búsquedas y prompts
  Usuario.associate = function(models) {
    Usuario.hasMany(models.Busqueda, { foreignKey: 'usuarioId' });
    Usuario.hasMany(models.Prompt, { foreignKey: 'usuarioId' });
  };

  return Usuario;
};