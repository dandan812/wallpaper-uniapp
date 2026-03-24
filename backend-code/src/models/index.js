const sequelize = require('../config/database');
const User = require('./User');
const Wallpaper = require('./Wallpaper');
const Category = require('./Category');
const Banner = require('./Banner');
const Notice = require('./Notice');
const Score = require('./Score');
const Download = require('./Download');

// 定义关联关系
// 在模型入口统一声明关联，避免 controller 中重复拼接外键关系。
// 当前这组关系主要服务于“评分/下载记录 反查 壁纸”和“用户历史列表”。
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
