#!/bin/bash

echo "=========================================="
echo "  前端 H5 一键部署脚本"
echo "  服务器: 8.135.46.112"
echo "=========================================="
echo ""

# 检查是否在服务器上执行
if [ ! -f "/etc/nginx/nginx.conf" ]; then
    echo "❌ 请在服务器上执行此脚本"
    exit 1
fi

# 创建部署目录
echo "1. 创建部署目录..."
mkdir -p /var/www/wallpaper-h5
cd /var/www/wallpaper-h5

# 配置 Nginx
echo ""
echo "2. 配置 Nginx..."

cat > /etc/nginx/sites-available/wallpaper-h5 << 'EOF'
server {
    listen 80;
    server_name 8.135.46.112;

    root /var/www/wallpaper-h5;
    index index.html;

    # H5 前端
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/wallpaper-h5 /etc/nginx/sites-enabled/

# 测试 Nginx 配置
echo ""
echo "3. 测试 Nginx 配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Nginx 配置正确"

    # 重载 Nginx
    echo ""
    echo "4. 重载 Nginx..."
    systemctl reload nginx

    echo ""
    echo "=========================================="
    echo "✅ 前端部署环境配置完成!"
    echo "=========================================="
    echo ""
    echo "下一步:"
    echo "1. 在本地编译前端项目 (HBuilderX 发行到 H5)"
    echo "2. 上传编译后的文件到服务器:"
    echo "   scp -r unpackage/dist/build/web/* root@8.135.46.112:/var/www/wallpaper-h5/"
    echo ""
    echo "3. 访问地址: http://8.135.46.112"
    echo ""
else
    echo "❌ Nginx 配置错误,请检查"
    exit 1
fi
