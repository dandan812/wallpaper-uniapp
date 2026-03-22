#!/bin/bash

echo "开始部署后端服务..."

# 拉取最新代码
cd /www/wwwroot/wallpaper-uniapp/backend-code
git pull

# 安装依赖
npm install

# 重启服务
pm2 restart wallpaper-api

echo "✓ 后端服务部署完成"
