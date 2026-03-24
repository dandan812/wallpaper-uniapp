# 壁纸小程序 - uni-app

一个基于 uni-app 的壁纸项目，当前仓库同时包含前端、后端和部署文档。

## 项目组成

- 前端：uni-app + Vue 3
- 后端：Node.js + Express + MySQL + Redis
- 文档：集中在 `docs/`，已按用途分层整理

## 快速开始

### 前端

1. 复制配置文件：

```bash
cp config/env.example.js config/env.js
```

2. 修改 `config/env.js` 中的 API 地址和 `accessKey`
3. 使用 HBuilderX 打开项目并运行

### 后端

```bash
cd backend-code
npm install
cp .env.example .env
npm run dev
```

如需初始化数据库，请执行：

```bash
mysql -u wallpaper_user -p wallpaper < init-user-tables.sql
```

## 文档入口

- [文档中心](docs/README.md)
- [快速开始](docs/getting-started/快速开始.md)
- [前后端配置](docs/configuration/前后端配置.md)
- [后端部署](docs/deployment/后端部署.md)
- [前端 H5 部署](docs/deployment/前端H5部署.md)
- [API 测试](docs/reference/API测试.md)
- [项目概览](docs/reference/项目概览.md)

## 项目结构

```text
univue3/
├── api/
├── components/
├── config/
├── docs/
├── pages/
├── static/
├── utils/
├── backend-code/
├── deploy-h5-local.sh
├── deploy-h5-server.sh
└── setup-config.sh
```

## 当前状态

- 前端和后端代码都已在仓库中
- H5 部署脚本已提供
- 文档已从平铺结构重组为分层结构

后端已经兼容前端历史接口命名，当前联调可直接使用，详情见 [项目概览](docs/reference/项目概览.md)。
