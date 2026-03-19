const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  picurl: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  select: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  wallpaper_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Category;
