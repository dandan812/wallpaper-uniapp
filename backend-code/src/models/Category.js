const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 分类表：既承载分类名称，也给首页专题卡片提供封面和排序。
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    // 分类名直接用于前端展示，也会参与跳转标题。
    type: DataTypes.STRING(50),
    allowNull: false
  },
  picurl: {
    // 分类封面图，首页“专题精选”卡片使用这个字段。
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  sort: {
    // 控制分类展示顺序，值越小越靠前。
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  select: {
    // 1 表示精选分类，首页专题区域会优先读取这类数据。
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  wallpaper_count: {
    // 冗余统计字段，用于减少首页或分类页再做实时 count 查询。
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
