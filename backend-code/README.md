# 壁纸小程序后端 API

后端代码位于 `backend-code/`，使用 Node.js + Express 提供 API 服务。

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
```

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
├── .env.example
├── deploy.sh
├── ecosystem.config.js
├── init-user-tables.sql
├── nginx.conf
└── package.json
```

## 当前实际接口

- `GET /api/classify`
- `GET /api/banner`
- `GET /api/wallList`
- `GET /api/detailWall/:id`
- `GET /api/randomWall`
- `GET /api/searchWall`
- `GET /api/notice`
- `GET /api/userInfo`
- `POST /api/setupScore`
- `POST /api/downloadWall`
- `GET /api/userWallList`

接口测试示例见 [docs/reference/API测试.md](../docs/reference/API测试.md)。

## 相关文档

- [文档中心](../docs/README.md)
- [快速开始](../docs/getting-started/快速开始.md)
- [前后端配置](../docs/configuration/前后端配置.md)
- [后端部署](../docs/deployment/后端部署.md)
- [项目概览](../docs/reference/项目概览.md)
