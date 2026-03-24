const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Score = sequelize.define('Score', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  wallpaper_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'scores',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'wallpaper_id']
    }
  ]
});

module.exports = Score;
