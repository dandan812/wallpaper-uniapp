DROP DATABASE IF EXISTS wallpaper;
CREATE DATABASE wallpaper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
GRANT ALL PRIVILEGES ON wallpaper.* TO 'wallpaper_user'@'localhost';
FLUSH PRIVILEGES;
