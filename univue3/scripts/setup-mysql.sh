#!/bin/bash

# MySQL 配置脚本 - 设置密码和创建数据库
# 适用于 MySQL 8.0

set -e

echo "=========================================="
echo "  配置 MySQL 数据库"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}请输入 MySQL root 密码:${NC}"
read -s MYSQL_ROOT_PASSWORD
echo ""

echo -e "${YELLOW}请输入数据库名称（默认: wallpaper）:${NC}"
read DB_NAME
DB_NAME=${DB_NAME:-wallpaper}

echo -e "${YELLOW}请输入数据库用户名（默认: wallpaper_user）:${NC}"
read DB_USER
DB_USER=${DB_USER:-wallpaper_user}

echo -e "${YELLOW}请输入数据库用户密码:${NC}"
read -s DB_PASSWORD
echo ""

echo ""
echo -e "${GREEN}开始配置 MySQL...${NC}"

# 设置 root 密码
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';"
mysql -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}✓ MySQL root 密码设置成功${NC}"

# 创建数据库和用户
mysql -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✓ 数据库创建成功${NC}"
echo -e "${GREEN}✓ 用户创建成功${NC}"

# 保存配置信息
cat > /root/wallpaper-config.txt << EOF
# 壁纸小程序配置信息
# 创建时间: $(date)

## 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}

## Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

## 服务器信息
SERVER_IP=$(curl -s ifconfig.me)
EOF

echo ""
echo "=========================================="
echo -e "${GREEN}  MySQL 配置完成！${NC}"
echo "=========================================="
echo ""
echo "数据库信息:"
echo "  - 数据库名: ${DB_NAME}"
echo "  - 用户名: ${DB_USER}"
echo "  - MySQL Root 密码: [已设置]"
echo "  - 数据库密码: [已设置]"
echo ""
echo -e "${GREEN}配置信息已保存到: /root/wallpaper-config.txt${NC}"
echo -e "${RED}请妥善保管此文件，包含敏感信息！${NC}"
echo ""
