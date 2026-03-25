# 壁纸小程序前端 - uni-app

这个目录现在只放前端项目和前端相关文档。

后端目录在同级位置：

- `../backend-code/`

## 当前目录负责什么

- uni-app 前端源码
- H5 构建产物
- 前端部署脚本
- 前端 / 联调 / 接口文档

## 快速开始

### 前端

```bash
cp config/env.example.js config/env.js
```

然后修改 `config/env.js`，再用 HBuilderX 打开 [univue3](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3) 运行。

### 后端

```bash
cd ../backend-code
npm install
cp .env.example .env
npm run dev
```

## 文档入口

- [文档中心](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/README.md)
- [快速开始](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/getting-started/快速开始.md)
- [前后端配置](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/configuration/前后端配置.md)
- [后端部署](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/deployment/后端部署.md)
- [前端 H5 部署](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/deployment/前端H5部署.md)
- [API 测试](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/API测试.md)
- [项目概览](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/项目概览.md)

## 目录结构

```text
uniappvue3/
├── backend-code/           # 后端项目
└── univue3/                # 前端项目
    ├── api/
    ├── components/
    ├── config/
    ├── docs/
    ├── pages/
    ├── scripts/
    └── ...
```
