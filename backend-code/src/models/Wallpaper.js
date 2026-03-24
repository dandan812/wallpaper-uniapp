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
    allowNull: false,
    field: 'small_picurl'
  },
  picurl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  title: {
    type: DataTypes.STRING(200)
  },
  description: {
    type: DataTypes.TEXT
  },
  tabs: {
    type: DataTypes.JSON
  },
  score_count: {
    type: DataTypes.INTEGER
  },
  download_count: {
    type: DataTypes.INTEGER
  },
  view_count: {
    type: DataTypes.INTEGER
  },
  nickname: {
    type: DataTypes.STRING(100)
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'wallpapers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Wallpaper;
