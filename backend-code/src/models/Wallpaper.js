const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wallpaper = sequelize.define('Wallpaper', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  classid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  smallPicurl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  picurl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'wallpaper',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Wallpaper;
