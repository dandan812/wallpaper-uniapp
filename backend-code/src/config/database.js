const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize 实例在整个项目中复用，统一管理数据库连接池。
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    // 连接池配置偏保守，足够支撑当前项目规模，同时避免空闲连接过多。
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
