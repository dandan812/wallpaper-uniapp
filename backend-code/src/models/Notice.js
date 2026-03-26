const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 公告表：给首页公告条和公告详情页提供内容。
const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    // 公告标题，首页列表和详情页都直接展示。
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    // 公告正文通常是富文本或长文本。
    type: DataTypes.TEXT
  },
  author: {
    // 发布人，详情页头部会直接展示。
    type: DataTypes.STRING(100)
  },
  view_count: {
    // 阅读量用于详情页展示。
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  select: {
    // 置顶/精选标记，首页公告位和详情页都可能依赖。
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  status: {
    // 预留状态位，默认 1 表示正常展示。
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'notices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Notice;
