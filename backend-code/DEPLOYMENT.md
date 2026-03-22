# 壁纸后端 API 部署文档

## 已完成功能

### 核心接口
- ✅ 分类列表接口 (GET /api/classify)
- ✅ 轮播图接口 (GET /api/homeBanner)
- ✅ 壁纸列表接口 (GET /api/wallList)
- ✅ 壁纸详情接口 (GET /api/detailWall/:id)
- ✅ 随机壁纸接口 (GET /api/randomWall)
- ✅ 搜索接口 (GET /api/searchWall)
- ✅ 公告列表接口 (GET /api/wallNewsList)
- ✅ 公告详情接口 (GET /api/wallNewsDetail/:id)

### 用户功能
- ✅ 用户信息接口 (GET /api/userInfo)
- ✅ 评分接口 (POST /api/setupScore)
- ✅ 下载记录接口 (POST /api/downloadWall)
- ✅ 用户历史接口 (GET /api/userWallList)

### 中间件
- ✅ Access Key 验证
- ✅ 错误处理中间件
- ✅ 日志中间件
- ✅ CORS 跨域支持

### 工具类
- ✅ Redis 缓存工具
- ✅ 统一响应格式

## 部署步骤

### 1. 上传代码到服务器

```bash
# 在服务器上执行
cd /var/www
git clone <你的仓库地址> wallpaper-api
cd wallpaper-api
```

### 2. 安装依赖

```bash
npm install --production
```

### 3. 配置环境变量

创建 `.env` 文件:

```env
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wallpaper
DB_USER=wallpaper_user
DB_PASSWORD=你的数据库密码

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=你的Redis密码

# API密钥
ACCESS_KEYS=key123456,key789012
```

### 4. 初始化用户相关表

```bash
mysql -u wallpaper_user -p wallpaper < init-user-tables.sql
```

### 5. 启动应用

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 6. 配置 Nginx

编辑 `/etc/nginx/sites-available/wallpaper-api`:

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

## API 接口说明

### 请求头

所有接口都需要在请求头中携带 `access-key`:

```
access-key: key123456
```

### 分类接口

**GET /api/classify**

查询参数:
- `select` (可选): 1=推荐分类

响应:
```json
{
  "errCode": 0,
  "errMsg": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "风景",
      "picurl": "https://...",
      "select": 1
    }
  ]
}
```

### 壁纸列表接口

**GET /api/wallList**

查询参数:
- `classid` (必填): 分类ID
- `limit` (可选): 每页数量,默认10
- `skip` (可选): 跳过数量,默认0

### 随机壁纸接口

**GET /api/randomWall**

查询参数:
- `limit` (可选): 数量,默认9

### 搜索接口

**GET /api/searchWall**

查询参数:
- `keyword` (必填): 搜索关键词
- `limit` (可选): 每页数量,默认10
- `skip` (可选): 跳过数量,默认0

### 评分接口

**POST /api/setupScore**

请求体:
```json
{
  "userId": 1,
  "wallpaperId": 100,
  "score": 4.5
}
```

### 下载记录接口

**POST /api/downloadWall**

请求体:
```json
{
  "userId": 1,
  "wallpaperId": 100
}
```

### 用户历史接口

**GET /api/userWallList**

查询参数:
- `userId` (必填): 用户ID
- `type` (必填): score=评分历史, download=下载历史
- `limit` (可选): 每页数量,默认10
- `skip` (可选): 跳过数量,默认0

## 性能优化

### Redis 缓存策略

- 分类列表: 10分钟
- 轮播图: 10分钟
- 壁纸列表: 30分钟
- 壁纸详情: 1小时
- 随机壁纸: 5分钟
- 搜索结果: 10分钟

### 数据库索引

已添加的索引:
- wallpapers.classid
- wallpapers.score
- scores(user_id, wallpaper_id) 唯一索引
- downloads(user_id, wallpaper_id)
- 全文索引: wallpapers(title, description, tabs)

## 监控和维护

### 查看日志

```bash
# PM2 日志
pm2 logs wallpaper-api

# 错误日志
tail -f logs/error.log

# 输出日志
tail -f logs/out.log
```

### 查看状态

```bash
pm2 status
pm2 monit
```

### 重启服务

```bash
pm2 restart wallpaper-api
```

## 常见问题

### 1. 数据库连接失败

检查 MySQL 是否运行:
```bash
systemctl status mysql
```

检查 .env 配置是否正确

### 2. Redis 连接失败

检查 Redis 是否运行:
```bash
systemctl status redis-server
```

### 3. 端口被占用

查看端口占用:
```bash
netstat -tulpn | grep :3000
```

## 下一步优化

- [ ] 添加图片上传功能 (OSS)
- [ ] 添加管理后台
- [ ] 添加数据统计功能
- [ ] 优化搜索性能
- [ ] 添加限流功能
- [ ] 添加 HTTPS 支持

---

**最后更新**: 2026-03-22
