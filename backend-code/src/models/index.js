const sequelize = require('../config/database');
const User = require('./User');
const Wallpaper = require('./Wallpaper');
const Category = require('./Category');
const Banner = require('./Banner');
const Notice = require('./Notice');
const Score = require('./Score');
const Download = require('./Download');

// 定义关联关系
Score.belongsTo(Wallpaper, { foreignKey: 'wallpaper_id' });
Wallpaper.hasMany(Score, { foreignKey: 'wallpaper_id' });

Download.belongsTo(Wallpaper, { foreignKey: 'wallpaper_id' });
Wallpaper.hasMany(Download, { foreignKey: 'wallpaper_id' });

Score.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Score, { foreignKey: 'user_id' });

Download.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Download, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Wallpaper,
  Category,
  Banner,
  Notice,
  Score,
  Download
};
