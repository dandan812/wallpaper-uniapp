const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 下载记录表：用于个人页统计和“我的下载”历史列表。
const Download = sequelize.define('Download', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    // 记录是哪个用户触发了下载。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  wallpaper_id: {
    // 指向被下载的壁纸。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classid: {
    // 冗余记录分类，便于后续按分类统计下载行为。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    // 下载行为时间，用于“最近下载”排序。
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'downloads',
  timestamps: false,
  indexes: [
    {
      // 历史列表最常见的筛选维度是 user_id + wallpaper_id，先建普通索引即可。
      fields: ['user_id', 'wallpaper_id']
    }
  ]
});

module.exports = Download;
