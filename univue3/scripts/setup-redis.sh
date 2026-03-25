#!/bin/bash

# Redis 配置脚本 - 设置密码

set -e

echo "=========================================="
echo "  配置 Redis 密码"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}请输入 Redis 密码:${NC}"
read -s REDIS_PASSWORD
echo ""

# 配置 Redis 密码
sed -i "s/# requirepass.*/requirepass ${REDIS_PASSWORD}/" /etc/redis/redis.conf

# 重启 Redis
systemctl restart redis-server

echo ""
echo -e "${GREEN}✓ Redis 密码设置成功${NC}"

# 测试连接
redis-cli -a ${REDIS_PASSWORD} ping > /dev/null 2>&1 && echo -e "${GREEN}✓ Redis 连接测试成功${NC}" || echo "✗ Redis 连接测试失败"

# 更新配置文件
if [ -f /root/wallpaper-config.txt ]; then
    sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=${REDIS_PASSWORD}/" /root/wallpaper-config.txt
    echo ""
    echo -e "${GREEN}配置已更新到: /root/wallpaper-config.txt${NC}"
fi

echo ""
