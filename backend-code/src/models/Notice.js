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
  }
}, {
  tableName: 'notices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Notice;
