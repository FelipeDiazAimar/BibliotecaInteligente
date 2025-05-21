// Este archivo centraliza la configuración y carga de todos los modelos de la base de datos.

const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crea la conexión a la base de datos usando los datos del archivo .env
let sequelize;
if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage,
    logging: console.log
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: console.log
  });
}

// No hay referencias a MySQL aquí, Sequelize usará el dialecto de la config.

// Carga todos los modelos definidos en la carpeta models
const modelDefiners = [
  require('./usuario'),
  require('./libro'),
  require('./busqueda'),
  require('./pregunta'),
  require('./respuesta'),
  require('./prompt')
];

// Define todos los modelos en sequelize
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, Sequelize.DataTypes);
}

// Establece las relaciones entre modelos (asociaciones)
const { Usuario, Busqueda, Prompt } = sequelize.models;

Usuario.hasMany(Busqueda, { foreignKey: 'usuarioId' });
Busqueda.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Prompt, { foreignKey: 'usuarioId' });
Prompt.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Exporta los modelos y la conexión para usarlos en el resto de la app
module.exports = {
  ...sequelize.models,
  sequelize,
  Sequelize
};