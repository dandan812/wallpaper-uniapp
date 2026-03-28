-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: wallpaper
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `picurl` varchar(500) NOT NULL,
  `url` varchar(500) DEFAULT '',
  `target` varchar(20) DEFAULT 'self',
  `appid` varchar(50) DEFAULT '',
  `sort` int DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_sort` (`status`,`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'https://picsum.photos/id/1025/960/540','/pages/classlist/classlist?id=1','self','',1,1,'2026-03-18 11:47:38'),(2,'https://picsum.photos/id/1015/960/540','/pages/classlist/classlist?id=2','self','',2,1,'2026-03-18 11:47:38'),(3,'https://picsum.photos/id/1005/960/540','/pages/classlist/classlist?id=3','self','',3,1,'2026-03-18 11:47:38');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `picurl` varchar(500) DEFAULT '',
  `sort` int DEFAULT '0',
  `select` tinyint DEFAULT '0',
  `wallpaper_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_select_sort` (`select`,`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'可爱萌宠','https://picsum.photos/id/1025/480/854',1,1,2,'2026-03-18 11:47:38','2026-03-23 12:58:38'),(2,'风景名胜','https://picsum.photos/id/1015/480/854',2,1,2,'2026-03-18 11:47:38','2026-03-23 12:58:38'),(3,'动漫二次元','https://picsum.photos/id/1005/480/854',3,1,2,'2026-03-18 11:47:38','2026-03-23 12:58:38'),(4,'创意色彩','https://picsum.photos/id/1060/480/854',4,1,2,'2026-03-18 11:47:38','2026-03-25 11:18:28'),(5,'游戏电竞','https://picsum.photos/id/1041/480/854',5,1,2,'2026-03-18 11:47:38','2026-03-25 12:26:21'),(6,'风景','https://picsum.photos/id/1036/480/854',1,0,2,'2026-03-19 00:45:49','2026-03-23 12:58:38'),(7,'动物','https://picsum.photos/id/1024/480/854',2,0,2,'2026-03-19 00:45:49','2026-03-23 12:58:38');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `downloads`
--

DROP TABLE IF EXISTS `downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `downloads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `wallpaper_id` int NOT NULL,
  `classid` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_created` (`user_id`,`created_at`),
  KEY `idx_wallpaper` (`wallpaper_id`),
  CONSTRAINT `downloads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `downloads_ibfk_2` FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downloads`
--

LOCK TABLES `downloads` WRITE;
/*!40000 ALTER TABLE `downloads` DISABLE KEYS */;
INSERT INTO `downloads` VALUES (1,1,1,1,'2026-03-24 02:44:36');
/*!40000 ALTER TABLE `downloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text,
  `author` varchar(100) DEFAULT '',
  `view_count` int DEFAULT '0',
  `select` tinyint DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_select_status` (`select`,`status`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'欢迎使用壁纸小程序','<p>感谢您使用我们的壁纸小程序！</p><p>这里有海量精美壁纸供您选择。</p>','管理员',0,1,1,'2026-03-18 11:47:38','2026-03-18 11:47:38'),(2,'使用说明','<p>1. 浏览分类选择喜欢的壁纸</p><p>2. 点击下载保存到相册</p><p>3. 可以为壁纸评分</p>','管理员',0,0,1,'2026-03-18 11:47:38','2026-03-18 11:47:38');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `wallpaper_id` int NOT NULL,
  `classid` int NOT NULL,
  `score` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_wallpaper` (`user_id`,`wallpaper_id`),
  KEY `idx_wallpaper` (`wallpaper_id`),
  KEY `idx_user_created` (`user_id`,`created_at`),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (1,1,1,1,4,'2026-03-24 02:44:36'),(2,1,2,1,4,'2026-03-24 02:44:36'),(3,1,9,5,4,'2026-03-25 05:47:41'),(4,1,10,5,1,'2026-03-25 05:47:53'),(5,1,11,6,0,'2026-03-25 06:27:12');
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) DEFAULT NULL,
  `nickname` varchar(100) DEFAULT '',
  `avatar` varchar(500) DEFAULT '',
  `ip` varchar(50) DEFAULT '',
  `address` varchar(200) DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`),
  KEY `idx_openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test_openid_001','测试用户','','127.0.0.1','本地测试','2026-03-18 11:47:38',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallpapers`
--

DROP TABLE IF EXISTS `wallpapers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallpapers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classid` int NOT NULL,
  `title` varchar(200) DEFAULT '',
  `description` text,
  `picurl` varchar(500) NOT NULL,
  `small_picurl` varchar(500) NOT NULL,
  `tabs` json DEFAULT NULL,
  `score` decimal(2,1) DEFAULT '0.0',
  `score_count` int DEFAULT '0',
  `download_count` int DEFAULT '0',
  `view_count` int DEFAULT '0',
  `nickname` varchar(100) DEFAULT '',
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_classid_status` (`classid`,`status`,`created_at`),
  KEY `idx_status` (`status`),
  CONSTRAINT `wallpapers_ibfk_1` FOREIGN KEY (`classid`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallpapers`
--

LOCK TABLES `wallpapers` WRITE;
/*!40000 ALTER TABLE `wallpapers` DISABLE KEYS */;
INSERT INTO `wallpapers` VALUES (1,1,'奶油小猫午后','一只蜷在阳光里的奶油小猫，适合作为治愈系手机壁纸。','https://picsum.photos/id/1025/1440/2560','https://picsum.photos/id/1025/480/854','[\"萌宠\", \"治愈\", \"猫咪\"]',4.0,1,129,526,'咸虾米',1,'2026-03-23 12:48:58','2026-03-24 02:44:36'),(2,1,'软萌小狗出游','清爽背景下的小狗写真，适合锁屏和桌面。','https://picsum.photos/id/237/1440/2560','https://picsum.photos/id/237/480/854','[\"萌宠\", \"小狗\", \"清新\"]',4.0,1,96,412,'咸虾米',1,'2026-03-23 12:48:58','2026-03-24 02:44:36'),(3,2,'山湖清晨薄雾','远山和湖面被晨雾包裹，画面安静通透。','https://picsum.photos/id/1015/1440/2560','https://picsum.photos/id/1015/480/854','[\"风景\", \"山川\", \"自然\"]',4.9,42,211,836,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:14'),(4,2,'海边落日晚霞','暖色晚霞与海面层次分明，适合做锁屏封面。','https://picsum.photos/id/1011/1440/2560','https://picsum.photos/id/1011/480/854','[\"海边\", \"晚霞\", \"风景\"]',4.8,34,175,690,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(5,3,'元气少女幻想','偏明亮配色的二次元人物插画风格壁纸。','https://picsum.photos/id/1005/1440/2560','https://picsum.photos/id/1005/480/854','[\"二次元\", \"少女\", \"插画\"]',4.6,18,84,301,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(6,3,'夜空城市幻想','冷色系幻想城市画面，适合喜欢动漫氛围感的人。','https://picsum.photos/id/1039/1440/2560','https://picsum.photos/id/1039/480/854','[\"二次元\", \"幻想\", \"夜景\"]',4.7,21,102,355,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(7,4,'撞色几何光影','高饱和撞色与几何图形结合，视觉冲击感强。','https://picsum.photos/id/1060/1440/2560','https://picsum.photos/id/1060/480/854','[\"创意\", \"撞色\", \"几何\"]',4.5,16,73,264,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(8,4,'流体渐变艺术','适合极简风桌面的抽象色彩壁纸。','https://picsum.photos/id/1056/1440/2560','https://picsum.photos/id/1056/480/854','[\"创意\", \"渐变\", \"抽象\"]',4.6,19,88,320,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(9,5,'电竞霓虹赛场','霓虹灯感和速度感兼具的电竞风壁纸。','https://picsum.photos/id/1041/1440/2560','https://picsum.photos/id/1041/480/854','[\"游戏\", \"电竞\", \"霓虹\"]',4.0,1,119,447,'咸虾米',1,'2026-03-23 12:48:58','2026-03-25 05:47:41'),(10,5,'机甲战斗氛围','厚重色调与机械质感结合，适合游戏党。','https://picsum.photos/id/1043/1440/2560','https://picsum.photos/id/1043/480/854','[\"游戏\", \"机甲\", \"酷炫\"]',1.0,1,133,488,'咸虾米',1,'2026-03-23 12:48:58','2026-03-25 05:47:53'),(11,6,'雪山与森林','高海拔雪山搭配密林，层次清晰耐看。','https://picsum.photos/id/1036/1440/2560','https://picsum.photos/id/1036/480/854','[\"自然\", \"雪山\", \"森林\"]',0.0,1,143,566,'咸虾米',1,'2026-03-23 12:48:58','2026-03-25 06:27:12'),(12,6,'峡谷瀑布清流','冷调风景图，适合偏安静的桌面风格。','https://picsum.photos/id/1033/1440/2560','https://picsum.photos/id/1033/480/854','[\"峡谷\", \"瀑布\", \"自然\"]',4.8,28,121,497,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(13,7,'林间小鹿回眸','带一点故事感的动物壁纸，氛围柔和。','https://picsum.photos/id/1024/1440/2560','https://picsum.photos/id/1024/480/854','[\"动物\", \"小鹿\", \"自然\"]',4.7,22,101,376,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15'),(14,7,'高原骏马奔跑','开阔背景下的奔跑瞬间，适合做全屏背景。','https://picsum.photos/id/1074/1440/2560','https://picsum.photos/id/1074/480/854','[\"动物\", \"骏马\", \"自由\"]',4.8,25,117,439,'咸虾米',1,'2026-03-23 12:48:58','2026-03-23 12:52:15');
/*!40000 ALTER TABLE `wallpapers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-25 21:45:12
