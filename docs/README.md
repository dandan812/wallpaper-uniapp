# 项目文档中心

`docs/` 已按“入门 / 配置 / 部署 / 参考 / 规划 / 归档”重新整理，优先看核心文档，阶段性记录放入归档，避免信息重复堆积在根目录。

## 先看哪一份

| 场景 | 建议先看 |
| --- | --- |
| 第一次接手项目 | [快速开始](./getting-started/快速开始.md) |
| 配置前后端联调 | [前后端配置](./configuration/前后端配置.md) |
| 部署后端 API | [后端部署](./deployment/后端部署.md) |
| 部署 H5 前端 | [前端 H5 部署](./deployment/前端H5部署.md) |
| 验证接口是否可用 | [API 测试](./reference/API测试.md) |
| 了解项目结构和已知问题 | [项目概览](./reference/项目概览.md) |
| 查看历史规划与任务 | [后端规划](./planning/后端规划.md) / [任务清单](./planning/任务清单.md) |

## 目录结构

```text
docs/
├── README.md
├── getting-started/
│   └── 快速开始.md
├── configuration/
│   └── 前后端配置.md
├── deployment/
│   ├── 后端部署.md
│   └── 前端H5部署.md
├── reference/
│   ├── API测试.md
│   └── 项目概览.md
├── planning/
│   ├── 后端规划.md
│   └── 任务清单.md
└── archive/
    ├── 归档说明.md
    ├── 配置完成总结.md
    ├── 后端第一阶段部署.md
    ├── 前端部署快速指南.md
    ├── 服务器检查命令.md
    ├── 服务器配置命令.md
    └── 文档整理记录.md
```

## 文档说明

- `getting-started/` 面向第一次启动项目的人，强调最短可运行路径。
- `configuration/` 说明前后端地址、`access-key` 和联调方式。
- `deployment/` 面向上线流程，按后端和 H5 前端拆开。
- `reference/` 存放当前实现的事实性说明，例如接口测试和项目结构。
- `planning/` 保留历史规划与任务拆解，供后续对照。
- `archive/` 保存阶段性记录、一次性命令和已被新文档替代的旧资料。

## 维护约定

- 新文档优先放入对应分类目录，不再直接堆在 `docs/` 根目录。
- 面向长期使用的文档保留在核心目录，阶段性过程记录放 `archive/`。
- 修改接口、路径或部署方式时，同时更新：
  - `docs/reference/项目概览.md`
  - `docs/reference/API测试.md`
  - 对应的部署或配置文档

## 当前值得注意的点

- 后端已经补上前端历史接口的兼容路由，联调时可以同时使用旧路径和新路径，详情见 [项目概览](./reference/项目概览.md)。
- `backend-code/.env.example` 中的密码仅可作为示例，部署前请替换为自己的强密码。
