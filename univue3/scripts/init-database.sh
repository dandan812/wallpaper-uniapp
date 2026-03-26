#!/bin/bash

# 数据库初始化脚本
# 创建所有必要的数据表

set -e

echo "=========================================="
echo "  初始化数据库表结构"
echo "=========================================="
echo ""

# 读取配置
if [ -f /root/wallpaper-config.txt ]; then
    source /root/wallpaper-config.txt
else
    echo "错误: 找不到配置文件 /root/wallpaper-config.txt"
    echo "请先运行 deploy-server.sh"
    exit 1
fi

echo "数据库: ${DB_NAME}"
echo "用户: ${DB_USER}"
echo ""

# 创建 SQL 文件
cat > /tmp/init-tables.sql << 'EOF'
-- 壁纸小程序数据库表结构
-- 创建时间: 2026-03-18

USE wallpaper;

-- 1. 分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `picurl` VARCHAR(500) DEFAULT '' COMMENT '分类封面图',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `select` TINYINT DEFAULT 0 COMMENT '是否推荐: 0-否, 1-是',
  `wallpaper_count` INT DEFAULT 0 COMMENT '壁纸数量',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_select_sort (`select`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 2. 壁纸表
CREATE TABLE IF NOT EXISTS `wallpapers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `classid` INT NOT NULL COMMENT '分类ID',
  `title` VARCHAR(200) DEFAULT '' COMMENT '标题',
  `description` TEXT COMMENT '描述',
  `picurl` VARCHAR(500) NOT NULL COMMENT '原图URL',
  `small_picurl` VARCHAR(500) NOT NULL COMMENT '缩略图URL',
  `tabs` JSON COMMENT '标签数组',
  `score` DECIMAL(2,1) DEFAULT 0 COMMENT '平均评分',
  `score_count` INT DEFAULT 0 COMMENT '评分人数',
  `download_count` INT DEFAULT 0 COMMENT '下载次数',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `nickname` VARCHAR(100) DEFAULT '' COMMENT '发布者昵称',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-待审核, 1-已发布, 2-已下架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_classid_status (`classid`, `status`, `created_at`),
  INDEX idx_status (`status`),
  FOREIGN KEY (`classid`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='壁纸表';

-- 3. 轮播图表
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `picurl` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `url` VARCHAR(500) DEFAULT '' COMMENT '跳转链接',
  `target` VARCHAR(20) DEFAULT 'self' COMMENT '跳转方式: self/miniProgram',
  `appid` VARCHAR(50) DEFAULT '' COMMENT '小程序appid',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status_sort (`status`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 4. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `openid` VARCHAR(100) UNIQUE COMMENT '微信openid',
  `nickname` VARCHAR(100) DEFAULT '' COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT '' COMMENT '头像',
  `ip` VARCHAR(50) DEFAULT '' COMMENT 'IP地址',
  `address` VARCHAR(200) DEFAULT '' COMMENT '地址信息',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` TIMESTAMP NULL COMMENT '最后登录时间',
  INDEX idx_openid (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 5. 评分记录表
CREATE TABLE IF NOT EXISTS `scores` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `wallpaper_id` INT NOT NULL COMMENT '壁纸ID',
  `classid` INT NOT NULL COMMENT '分类ID',
  `score` DECIMAL(2,1) NOT NULL COMMENT '评分 0-5，支持半星',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_wallpaper (`user_id`, `wallpaper_id`),
  INDEX idx_wallpaper (`wallpaper_id`),
  INDEX idx_user_created (`user_id`, `created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分记录表';

-- 6. 下载记录表
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `wallpaper_id` INT NOT NULL COMMENT '壁纸ID',
  `classid` INT NOT NULL COMMENT '分类ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_created (`user_id`, `created_at`),
  INDEX idx_wallpaper (`wallpaper_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='下载记录表';

-- 7. 公告表
CREATE TABLE IF NOT EXISTS `notices` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT COMMENT '内容（富文本）',
  `author` VARCHAR(100) DEFAULT '' COMMENT '作者',
  `view_count` INT DEFAULT 0 COMMENT '阅读量',
  `select` TINYINT DEFAULT 0 COMMENT '是否置顶: 0-否, 1-是',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-草稿, 1-已发布',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_select_status (`select`, `status`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 插入测试数据

-- 插入分类
INSERT INTO `categories` (`name`, `picurl`, `sort`, `select`) VALUES
('可爱萌宠', 'https://picsum.photos/id/1025/480/854', 1, 1),
('风景名胜', 'https://picsum.photos/id/1015/480/854', 2, 1),
('动漫二次元', 'https://picsum.photos/id/1005/480/854', 3, 1),
('创意色彩', 'https://picsum.photos/id/1060/480/854', 4, 1),
('游戏电竞', 'https://picsum.photos/id/1041/480/854', 5, 1),
('城市建筑', 'https://picsum.photos/id/1040/480/854', 6, 0),
('极简插画', 'https://picsum.photos/id/1020/480/854', 7, 0),
('汽车机车', 'https://picsum.photos/id/1071/480/854', 8, 0),
('宇宙星空', 'https://picsum.photos/id/1063/480/854', 9, 0),
('美食静物', 'https://picsum.photos/id/1080/480/854', 10, 0);

-- 插入轮播图
INSERT INTO `banners` (`picurl`, `url`, `sort`, `status`) VALUES
('https://picsum.photos/id/1025/960/540', '/pages/classlist/classlist?id=1&name=可爱萌宠', 1, 1),
('https://picsum.photos/id/1015/960/540', '/pages/classlist/classlist?id=2&name=风景名胜', 2, 1),
('https://picsum.photos/id/1005/960/540', '/pages/classlist/classlist?id=3&name=动漫二次元', 3, 1);

-- 插入公告
INSERT INTO `notices` (`title`, `content`, `author`, `select`, `status`) VALUES
('欢迎使用壁纸小程序', '<p>感谢您使用我们的壁纸小程序！</p><p>这里有海量精美壁纸供您选择。</p>', '管理员', 1, 1),
('使用说明', '<p>1. 浏览分类选择喜欢的壁纸</p><p>2. 点击下载保存到相册</p><p>3. 可以为壁纸评分</p>', '管理员', 0, 1);

-- 插入测试用户
INSERT INTO `users` (`openid`, `nickname`, `ip`, `address`) VALUES
('test_openid_001', '测试用户', '127.0.0.1', '本地测试');

-- 插入壁纸测试数据
INSERT INTO `wallpapers`
(`classid`, `title`, `description`, `picurl`, `small_picurl`, `tabs`, `score`, `score_count`, `download_count`, `view_count`, `nickname`, `status`) VALUES
(1, '奶油小猫午后', '一只蜷在阳光里的奶油小猫，适合作为治愈系手机壁纸。', 'https://picsum.photos/id/1025/1440/2560', 'https://picsum.photos/id/1025/480/854', JSON_ARRAY('萌宠','治愈','猫咪'), 4.2, 12, 129, 526, '咸虾米', 1),
(1, '软萌小狗出游', '披着毛毯的小狗，氛围安静温暖。', 'https://picsum.photos/id/237/1440/2560', 'https://picsum.photos/id/237/480/854', JSON_ARRAY('萌宠','狗狗','温柔'), 4.5, 18, 166, 692, '咸虾米', 1),
(2, '山湖清晨薄雾', '雪山、帐篷和湖面构成的清冷风景。', 'https://picsum.photos/id/1015/1440/2560', 'https://picsum.photos/id/1015/480/854', JSON_ARRAY('风景','雪山','自然'), 4.6, 23, 210, 850, '咸虾米', 1),
(2, '海边落日晚霞', '蓝色海岸线配合金色晚霞，适合做锁屏。', 'https://picsum.photos/id/1011/1440/2560', 'https://picsum.photos/id/1011/480/854', JSON_ARRAY('风景','海边','晚霞'), 4.3, 16, 180, 721, '咸虾米', 1),
(3, '元气少女幻想', '柔和色调的人像壁纸，适合二次元主题。', 'https://picsum.photos/id/1005/1440/2560', 'https://picsum.photos/id/1005/480/854', JSON_ARRAY('动漫','幻想','人物'), 4.4, 20, 199, 744, '咸虾米', 1),
(3, '夜空城市幻想', '偏未来感的夜景壁纸，氛围感强。', 'https://picsum.photos/id/1039/1440/2560', 'https://picsum.photos/id/1039/480/854', JSON_ARRAY('动漫','夜景','未来'), 4.1, 14, 154, 690, '咸虾米', 1),
(4, '撞色几何光影', '高饱和几何切面，适合桌面和锁屏。', 'https://picsum.photos/id/1060/1440/2560', 'https://picsum.photos/id/1060/480/854', JSON_ARRAY('创意','几何','撞色'), 4.0, 11, 143, 531, '咸虾米', 1),
(4, '流体渐变艺术', '流体艺术和柔和渐变结合的创意壁纸。', 'https://picsum.photos/id/1056/1440/2560', 'https://picsum.photos/id/1056/480/854', JSON_ARRAY('创意','渐变','流体'), 4.7, 22, 240, 901, '咸虾米', 1),
(5, '电竞霓虹赛场', '带有霓虹氛围和游戏空间感的壁纸。', 'https://picsum.photos/id/1041/1440/2560', 'https://picsum.photos/id/1041/480/854', JSON_ARRAY('电竞','霓虹','科技'), 4.5, 19, 268, 980, '咸虾米', 1),
(5, '机甲战斗氛围', '机械感和金属质感较强的电竞主题图。', 'https://picsum.photos/id/1043/1440/2560', 'https://picsum.photos/id/1043/480/854', JSON_ARRAY('电竞','机甲','酷炫'), 4.3, 17, 205, 812, '咸虾米', 1),
(6, '城市街角黄昏', '现代城市建筑在黄昏光线下的层次感。', 'https://picsum.photos/id/1040/1440/2560', 'https://picsum.photos/id/1040/480/854', JSON_ARRAY('城市','建筑','黄昏'), 4.2, 15, 173, 668, '咸虾米', 1),
(6, '高楼玻璃反射', '商务大楼和玻璃反射构成的极简城市风。', 'https://picsum.photos/id/1031/1440/2560', 'https://picsum.photos/id/1031/480/854', JSON_ARRAY('城市','高楼','现代'), 4.1, 13, 149, 577, '咸虾米', 1),
(7, '奶油系插画女孩', '色彩柔和的插画头像，适合年轻化界面。', 'https://picsum.photos/id/1020/1440/2560', 'https://picsum.photos/id/1020/480/854', JSON_ARRAY('插画','治愈','简约'), 4.6, 21, 221, 845, '咸虾米', 1),
(7, '极简线条人物', '留白和线条感更强的极简插画壁纸。', 'https://picsum.photos/id/1021/1440/2560', 'https://picsum.photos/id/1021/480/854', JSON_ARRAY('插画','线条','简洁'), 4.4, 18, 187, 733, '咸虾米', 1),
(8, '红色跑车街拍', '高对比度跑车照片，适合速度感主题。', 'https://picsum.photos/id/1071/1440/2560', 'https://picsum.photos/id/1071/480/854', JSON_ARRAY('汽车','跑车','速度'), 4.8, 27, 302, 1104, '咸虾米', 1),
(8, '复古机车静态', '偏复古风格的机车细节特写。', 'https://picsum.photos/id/1072/1440/2560', 'https://picsum.photos/id/1072/480/854', JSON_ARRAY('机车','复古','金属'), 4.3, 16, 176, 689, '咸虾米', 1),
(9, '银河深空微光', '蓝紫色星空层次明显，适合深色锁屏。', 'https://picsum.photos/id/1063/1440/2560', 'https://picsum.photos/id/1063/480/854', JSON_ARRAY('星空','宇宙','梦幻'), 4.9, 30, 340, 1222, '咸虾米', 1),
(9, '月面静谧夜色', '偏冷色调的月面和夜空主题壁纸。', 'https://picsum.photos/id/903/1440/2560', 'https://picsum.photos/id/903/480/854', JSON_ARRAY('宇宙','月球','夜空'), 4.5, 19, 208, 801, '咸虾米', 1),
(10, '咖啡器具质感', '暖色咖啡器具静物，适合作为生活感壁纸。', 'https://picsum.photos/id/1067/1440/2560', 'https://picsum.photos/id/1067/480/854', JSON_ARRAY('美食','咖啡','静物'), 4.2, 12, 141, 520, '咸虾米', 1),
(10, '甜品桌面摆拍', '甜品与餐具的整洁摆拍，画面干净。', 'https://picsum.photos/id/1080/1440/2560', 'https://picsum.photos/id/1080/480/854', JSON_ARRAY('美食','甜品','生活'), 4.4, 18, 190, 708, '咸虾米', 1);

UPDATE `categories` c
SET `wallpaper_count` = (
  SELECT COUNT(*) FROM `wallpapers` w WHERE w.classid = c.id
);

EOF

# 执行 SQL
echo "正在创建数据表..."
mysql -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < /tmp/init-tables.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  数据库初始化完成！"
    echo "=========================================="
    echo ""
    echo "已创建的表:"
    mysql -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "SHOW TABLES;"
    echo ""
    echo "测试数据:"
    echo "  - 10 个分类"
    echo "  - 3 个轮播图"
    echo "  - 2 条公告"
    echo "  - 1 个测试用户"
    echo "  - 20 张测试壁纸"
    echo ""
else
    echo "错误: 数据库初始化失败"
    exit 1
fi

# 清理临时文件
rm -f /tmp/init-tables.sql

echo "下一步: 部署后端应用"

