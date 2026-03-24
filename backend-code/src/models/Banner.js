const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 轮播图表：主要给首页 banner 使用，数据量小、读取频率高。
const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  picurl: {
    // 轮播图图片地址，前端直接渲染。
    type: DataTypes.STRING(500),
    allowNull: false
  },
  target: {
    // 保留跳转类型字段，便于后续扩展 H5、文章、外链或小程序跳转。
    type: DataTypes.STRING(500)
  },
  sort: {
    // 数值越小越靠前，首页轮播图按该字段升序展示。
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Banner;
