# 壁纸小程序后端 API

后端代码位于 `backend-code/`，使用 `Node.js + Express + Sequelize` 提供 API 服务。

## 快速开始

```bash
npm install
cp .env.example .env
npm run dev
```

如需初始化用户相关表：

```bash
mysql -u wallpaper_user -p wallpaper < init-user-tables.sql
```

## 常用脚本

```bash
# 开发环境
npm run dev

# 生产环境
pm2 start ecosystem.config.js

# 服务器更新代码并保留本机 .env
./deploy.sh
```

## 生产部署说明

生产环境的 `.env` 只保留在服务器本机：

- 服务器路径：`/var/www/wallpaper-api/.env`
- 不要再用本地开发 `.env` 直接覆盖服务器生产 `.env`
- 日常更新代码时，进入服务器目录后执行 `./deploy.sh`

`deploy.sh` 当前会自动执行这些动作：

1. 先备份服务器现有 `.env`
2. `git pull` 拉取最新代码
3. 恢复服务器本机 `.env`
4. 安装生产依赖
5. `pm2 startOrRestart ecosystem.config.js`

这样做的目的是避免开发环境里的数据库、Redis、鉴权配置误覆盖线上配置。

## 目录结构

```text
backend-code/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── scripts/
├── .env.example
├── ecosystem.config.js
├── init-user-tables.sql
└── package.json
```

## 当前主接口

- `GET /api/categories`
- `GET /api/banners`
- `GET /api/notices`
- `GET /api/notices/:id`
- `GET /api/wallpapers`
- `GET /api/wallpapers/:id`
- `GET /api/wallpapers/random`
- `GET /api/wallpapers/search`
- `GET /api/users/me`
- `GET /api/users/wallpapers`
- `POST /api/wallpapers/score`
- `POST /api/wallpapers/download`

后端仍保留旧路径兼容，但不再作为前端和文档主入口。

## 相关文档

- [文档中心](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/README.md)
- [前后端配置](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/configuration/前后端配置.md)
- [API测试](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/API测试.md)
- [Apifox接口清单](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/Apifox接口清单.md)
- [后端代码阅读说明](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/后端代码阅读说明.md)
- [项目概览](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/项目概览.md)
