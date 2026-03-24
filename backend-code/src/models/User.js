const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(100)
  },
  avatar: {
    type: DataTypes.STRING(500)
  },
  ip: {
    type: DataTypes.STRING(50)
  },
  address: {
    type: DataTypes.STRING(200)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
