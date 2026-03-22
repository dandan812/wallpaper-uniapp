#!/bin/bash

echo "开始部署后端服务..."

# 进入项目目录
cd /var/www/wallpaper-api || exit

# 拉取最新代码
echo "拉取最新代码..."
git pull origin main

# 安装依赖
echo "安装依赖..."
npm install --production

# 重启 PM2
echo "重启应用..."
pm2 restart ecosystem.config.js

# 查看状态
pm2 status

echo "✓ 后端服务部署完成"

