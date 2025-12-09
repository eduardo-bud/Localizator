const { Sequelize } = require('sequelize');

// Configurações básicas; personalize via variáveis de ambiente
const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
const DB_STORAGE = process.env.DB_STORAGE || 'database.sqlite';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'appdb';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

let sequelize;
if (DB_DIALECT === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_STORAGE,
    logging: false,
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,
  });
}

module.exports = sequelize;
