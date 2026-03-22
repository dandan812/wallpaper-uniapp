# 快速部署指南

## 第一步：准备服务器环境

SSH 登录服务器:
```bash
ssh root@8.135.46.112
```

## 第二步：上传代码

### 方法一：使用 Git (推荐)

```bash
cd /var/www
git clone <你的仓库地址> wallpaper-api
cd wallpaper-api
```

### 方法二：手动上传

使用 SCP 或 FTP 工具上传 `backend-code` 目录到服务器 `/var/www/wallpaper-api`

## 第三步：安装依赖

```bash
cd /var/www/wallpaper-api
npm install --production
```

## 第四步：配置环境变量

```bash
nano .env
```

复制以下内容并修改密码:

```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=wallpaper
DB_USER=wallpaper_user
DB_PASSWORD=你的数据库密码

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=你的Redis密码

ACCESS_KEYS=key123456,key789012
```

保存: Ctrl+O, 回车, Ctrl+X

## 第五步：初始化用户表

```bash
mysql -u wallpaper_user -p wallpaper < init-user-tables.sql
```

输入数据库密码后回车

## 第六步：启动应用

```bash
# 创建日志目录
mkdir -p logs

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs wallpaper-api

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 第七步：配置 Nginx

```bash
nano /etc/nginx/sites-available/wallpaper-api
```

复制以下内容:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置:

```bash
ln -s /etc/nginx/sites-available/wallpaper-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 第八步：测试接口

```bash
# 测试根路径
curl http://localhost:3000/

# 测试分类接口
curl -H "access-key: key123456" http://localhost:3000/api/classify
```

## 完成！

现在你的 API 已经运行在:
- 本地: http://localhost:3000
- 外网: http://api.yourdomain.com (需要配置域名)

## 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs wallpaper-api

# 重启应用
pm2 restart wallpaper-api

# 停止应用
pm2 stop wallpaper-api

# 查看监控
pm2 monit
```

## 更新代码

```bash
cd /var/www/wallpaper-api
git pull
npm install --production
pm2 restart wallpaper-api
```

或使用部署脚本:

```bash
chmod +x deploy.sh
./deploy.sh
```
