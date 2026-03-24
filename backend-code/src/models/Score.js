const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 评分记录表：每条记录代表“某个用户给某张壁纸打了一次分”。
const Score = sequelize.define('Score', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    // 当前评分所属用户。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  wallpaper_id: {
    // 当前评分对应的壁纸。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classid: {
    // 冗余存储分类，后续可用于分组统计或报表。
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    // 评分值范围当前由 controller 控制在 0 到 5 之间。
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false
  },
  created_at: {
    // 评分时间，用于判断最近评分记录。
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'scores',
  timestamps: false,
  indexes: [
    {
      // 同一用户对同一张壁纸只能评一次，避免重复刷分。
      unique: true,
      fields: ['user_id', 'wallpaper_id']
    }
  ]
});

module.exports = Score;
