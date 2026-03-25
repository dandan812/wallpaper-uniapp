#!/bin/bash

# 壁纸小程序后端 - 服务器环境部署脚本
# 适用于: Ubuntu 24.04, 2核2G服务器
# 作者: dandan812
# 日期: 2026-03-18

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  壁纸小程序后端 - 服务器环境部署"
echo "  服务器配置: 2核2G Ubuntu 24.04"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
    exit 1
fi

echo -e "${GREEN}[1/8] 更新系统软件包...${NC}"
apt update && apt upgrade -y

echo ""
echo -e "${GREEN}[2/8] 安装基础工具...${NC}"
apt install -y curl wget git vim build-essential

echo ""
echo -e "${GREEN}[3/8] 安装 Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
echo "Node.js 版本: $(node -v)"
echo "NPM 版本: $(npm -v)"

echo ""
echo -e "${GREEN}[4/8] 安装 MySQL 8.0...${NC}"
apt install -y mysql-server

# 启动 MySQL
systemctl start mysql
systemctl enable mysql

echo ""
echo -e "${YELLOW}配置 MySQL（针对 2G 内存优化）...${NC}"

# 创建 MySQL 配置文件
cat > /etc/mysql/mysql.conf.d/custom.cnf << 'EOF'
[mysqld]
# 针对 2G 内存优化
innodb_buffer_pool_size = 512M
max_connections = 50
query_cache_size = 32M
table_open_cache = 256
innodb_log_file_size = 128M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

[client]
default-character-set = utf8mb4
EOF

# 重启 MySQL 使配置生效
systemctl restart mysql

echo ""
echo -e "${YELLOW}设置 MySQL root 密码...${NC}"
echo "请输入 MySQL root 密码（建议使用强密码）:"
read -s MYSQL_ROOT_PASSWORD

# 设置 root 密码
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';"
mysql -e "FLUSH PRIVILEGES;"

echo ""
echo -e "${YELLOW}创建壁纸数据库和用户...${NC}"
echo "请输入数据库名称（默认: wallpaper）:"
read DB_NAME
DB_NAME=${DB_NAME:-wallpaper}

echo "请输入数据库用户名（默认: wallpaper_user）:"
read DB_USER
DB_USER=${DB_USER:-wallpaper_user}

echo "请输入数据库用户密码:"
read -s DB_PASSWORD

# 创建数据库和用户
mysql -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}数据库创建成功！${NC}"

echo ""
echo -e "${GREEN}[5/8] 安装 Redis...${NC}"
apt install -y redis-server

# 配置 Redis（针对 2G 内存优化）
cat > /etc/redis/redis.conf << 'EOF'
# Redis 配置（针对 2G 内存优化）
bind 127.0.0.1
port 6379
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log

# 内存限制
maxmemory 256mb
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /var/lib/redis

# 安全
requirepass your_redis_password_here
EOF

echo "请输入 Redis 密码:"
read -s REDIS_PASSWORD
sed -i "s/your_redis_password_here/${REDIS_PASSWORD}/g" /etc/redis/redis.conf

# 重启 Redis
systemctl restart redis-server
systemctl enable redis-server

echo -e "${GREEN}Redis 安装成功！${NC}"

echo ""
echo -e "${GREEN}[6/8] 安装 Nginx...${NC}"
apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}Nginx 安装成功！${NC}"

echo ""
echo -e "${GREEN}[7/8] 安装 PM2（Node.js 进程管理器）...${NC}"
npm install -g pm2

# 配置 PM2 开机自启
pm2 startup systemd -u root --hp /root
echo -e "${GREEN}PM2 安装成功！${NC}"

echo ""
echo -e "${GREEN}[8/8] 安装 Certbot（SSL 证书）...${NC}"
apt install -y certbot python3-certbot-nginx

echo ""
echo "=========================================="
echo -e "${GREEN}  环境部署完成！${NC}"
echo "=========================================="
echo ""
echo "已安装的软件:"
echo "  - Node.js: $(node -v)"
echo "  - NPM: $(npm -v)"
echo "  - MySQL: $(mysql --version | awk '{print $5}' | sed 's/,//')"
echo "  - Redis: $(redis-server --version | awk '{print $3}')"
echo "  - Nginx: $(nginx -v 2>&1 | awk '{print $3}')"
echo "  - PM2: $(pm2 -v)"
echo ""
echo "数据库信息:"
echo "  - 数据库名: ${DB_NAME}"
echo "  - 用户名: ${DB_USER}"
echo "  - MySQL Root 密码: [已设置]"
echo "  - 数据库密码: [已设置]"
echo "  - Redis 密码: [已设置]"
echo ""
echo "配置文件位置:"
echo "  - MySQL: /etc/mysql/mysql.conf.d/custom.cnf"
echo "  - Redis: /etc/redis/redis.conf"
echo "  - Nginx: /etc/nginx/sites-available/"
echo ""
echo -e "${YELLOW}重要提示:${NC}"
echo "  1. 请保存好数据库密码和 Redis 密码"
echo "  2. 建议修改 SSH 端口并配置防火墙"
echo "  3. 定期备份数据库"
echo ""
echo "下一步:"
echo "  1. 创建 .env 配置文件"
echo "  2. 初始化数据库表结构"
echo "  3. 部署后端应用"
echo ""
echo "=========================================="

# 保存配置信息到文件
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
REDIS_PASSWORD=${REDIS_PASSWORD}

## 服务器信息
SERVER_IP=$(curl -s ifconfig.me)
EOF

echo -e "${GREEN}配置信息已保存到: /root/wallpaper-config.txt${NC}"
echo -e "${RED}请妥善保管此文件，包含敏感信息！${NC}"
