const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  picurl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  target: {
    type: DataTypes.STRING(500)
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'banner',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Banner;
