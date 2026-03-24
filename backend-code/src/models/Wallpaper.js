const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 壁纸主表：前端大部分页面最终都围绕这张表读取数据。
const Wallpaper = sequelize.define('Wallpaper', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  classid: {
    // 所属分类，列表页和专题推荐都依赖这个字段筛选。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  smallPicurl: {
    // Sequelize 字段名和数据库真实列名不同，这里显式映射到 small_picurl。
    // 这是之前线上报 “Unknown column smallPicurl” 时的关键修复点。
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'small_picurl'
  },
  picurl: {
    // 大图地址，详情页和下载功能主要使用它。
    type: DataTypes.STRING(500),
    allowNull: false
  },
  score: {
    // 壁纸平均分，由评分接口异步回写，不是用户单次评分值。
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  title: {
    // 标题会参与搜索，也会在详情页展示。
    type: DataTypes.STRING(200)
  },
  description: {
    // 描述同样参与搜索，适合写图片说明或文案。
    type: DataTypes.TEXT
  },
  tabs: {
    // 标签字段当前使用 JSON，方便前端直接按数组渲染。
    type: DataTypes.JSON
  },
  score_count: {
    // 累计评分人数，和平均分一起回写到主表减少实时聚合开销。
    type: DataTypes.INTEGER
  },
  download_count: {
    // 累计下载次数，由下载接口异步自增。
    type: DataTypes.INTEGER
  },
  view_count: {
    // 详情访问次数，由详情接口异步自增。
    type: DataTypes.INTEGER
  },
  nickname: {
    // 发布者昵称或展示来源，当前主要用于详情页补充信息。
    type: DataTypes.STRING(100)
  },
  status: {
    // 预留状态位，默认 1 表示正常可展示。
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
