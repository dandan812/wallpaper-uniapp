#!/bin/bash

# 继续完成部署 - 安装 Redis、Nginx、PM2
# 由于 MySQL 配置文件有问题，我们手动完成剩余安装

set -e

echo "=========================================="
echo "  继续完成环境部署"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}[1/4] 安装 Redis...${NC}"
apt install -y redis-server

echo ""
echo -e "${YELLOW}配置 Redis（针对 2G 内存优化）...${NC}"

# 备份原配置
cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# 配置 Redis
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

# 安全（暂时不设置密码，后续手动设置）
# requirepass your_redis_password
EOF

# 启动 Redis
systemctl restart redis-server
systemctl enable redis-server

echo -e "${GREEN}Redis 安装成功！${NC}"

echo ""
echo -e "${GREEN}[2/4] 安装 Nginx...${NC}"
apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}Nginx 安装成功！${NC}"

echo ""
echo -e "${GREEN}[3/4] 安装 PM2...${NC}"
npm install -g pm2

# 配置 PM2 开机自启
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}PM2 安装成功！${NC}"

echo ""
echo -e "${GREEN}[4/4] 安装 Certbot（SSL 证书）...${NC}"
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
echo "服务状态:"
systemctl is-active mysql && echo "  - MySQL: 运行中 ✓" || echo "  - MySQL: 未运行 ✗"
systemctl is-active redis-server && echo "  - Redis: 运行中 ✓" || echo "  - Redis: 未运行 ✗"
systemctl is-active nginx && echo "  - Nginx: 运行中 ✓" || echo "  - Nginx: 未运行 ✗"
echo ""
echo "下一步:"
echo "  1. 设置 MySQL root 密码"
echo "  2. 创建数据库和用户"
echo "  3. 设置 Redis 密码"
echo "  4. 初始化数据库表结构"
echo ""
