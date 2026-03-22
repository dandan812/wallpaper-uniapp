-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `ip_location` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评分表
CREATE TABLE IF NOT EXISTS `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `wallpaper_id` int NOT NULL,
  `score` decimal(2,1) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_wallpaper` (`user_id`, `wallpaper_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_wallpaper_id` (`wallpaper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 下载记录表
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `wallpaper_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_wallpaper_id` (`wallpaper_id`),
  KEY `idx_user_wallpaper` (`user_id`, `wallpaper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 为壁纸表添加字段（如果不存在）
ALTER TABLE `wallpapers`
ADD COLUMN IF NOT EXISTS `view_count` int DEFAULT 0,
ADD COLUMN IF NOT EXISTS `download_count` int DEFAULT 0,
ADD COLUMN IF NOT EXISTS `score_count` int DEFAULT 0;

-- 为壁纸表添加索引
ALTER TABLE `wallpapers`
ADD INDEX IF NOT EXISTS `idx_classid` (`classid`),
ADD INDEX IF NOT EXISTS `idx_score` (`score`);

-- 为搜索添加全文索引
ALTER TABLE `wallpapers`
ADD FULLTEXT INDEX IF NOT EXISTS `ft_search` (`title`, `description`, `tabs`);
