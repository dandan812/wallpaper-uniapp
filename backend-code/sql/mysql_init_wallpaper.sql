CREATE DATABASE IF NOT EXISTS wallpaper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'wallpaper_user'@'localhost' IDENTIFIED BY 'DbPass@2026';
ALTER USER 'wallpaper_user'@'localhost' IDENTIFIED BY 'DbPass@2026';
GRANT ALL PRIVILEGES ON wallpaper.* TO 'wallpaper_user'@'localhost';
FLUSH PRIVILEGES;
