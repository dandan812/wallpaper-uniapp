const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 用户表：当前项目只用了基础画像字段，还没有接入完整登录体系。
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    // 为后续接微信或小程序登录预留的唯一标识。
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  nickname: {
    // 用户昵称直接用于个人页展示。
    type: DataTypes.STRING(100)
  },
  avatar: {
    // 头像地址，当前前端没有复杂裁剪逻辑，直接渲染原图。
    type: DataTypes.STRING(500)
  },
  ip: {
    // 最近一次访问来源 IP，可用于展示或简单风控。
    type: DataTypes.STRING(50)
  },
  address: {
    // 地址目前存成一段字符串，controller 中会再拆成结构化对象。
    type: DataTypes.STRING(200)
  },
  created_at: {
    // 首次创建用户时间。
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login_at: {
    // 最后登录时间，为以后接登录态留接口。
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
