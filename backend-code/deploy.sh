#!/bin/bash

set -e

echo "开始部署后端服务..."

# 进入项目目录
cd /var/www/wallpaper-api || exit

# 生产环境配置只保留在服务器本机，部署代码时不覆盖 .env。
if [ ! -f ".env" ]; then
    echo "❌ 未找到服务器生产环境配置 .env"
    echo "请先在服务器上创建 /var/www/wallpaper-api/.env"
    exit 1
fi

TEMP_ENV="$(mktemp)"
cp .env "${TEMP_ENV}"

# 拉取最新代码
echo "拉取最新代码..."
git pull origin main

# 无论仓库里是否存在 .env，都始终恢复服务器本机配置。
cp "${TEMP_ENV}" .env
rm -f "${TEMP_ENV}"

# 安装依赖
echo "安装依赖..."
npm install --omit=dev

# 重启 PM2
echo "重启应用..."
pm2 startOrRestart ecosystem.config.js

# 查看状态
pm2 status

echo "✓ 后端服务部署完成"
