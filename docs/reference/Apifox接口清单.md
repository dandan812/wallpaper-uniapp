# Apifox接口清单

这份文档按当前后端实际代码整理，适合作为 Apifox 手动录入或二次整理的基础稿。

如果你希望直接导入 Apifox，可以优先使用：

- [Apifox导入.json](C:/Users/hulian/Desktop/huliang/bizi/univue3/docs/reference/Apifox导入.json)

适用后端入口：

- 线上：`http://8.135.46.112/api`
- 本地：`http://localhost:3000/api`

## 1. Apifox 建议环境变量

建议先在 Apifox 里配置两个环境变量：

```text
baseUrl = http://8.135.46.112/api
accessKey = key123456
```

公共请求头：

```http
access-key: {{accessKey}}
Content-Type: application/json
```

说明：

- 所有 `/api/*` 路由都需要 `access-key`
- `access-key` 也支持通过查询参数 `accessKey` 传递，但建议统一走请求头

## 2. 公共返回结构

成功返回：

```json
{
  "errCode": 0,
  "errMsg": "查询成功",
  "data": {},
  "timeCost": 0,
  "total": 0
}
```

失败返回：

```json
{
  "errCode": 400,
  "errMsg": "参数不完整",
  "data": null,
  "timeCost": 0
}
```

常见错误码：

- `0`：成功
- `400`：参数错误/业务错误
- `401`：`access-key` 无效
- `404`：资源不存在

## 3. 分类分类

### 3.1 获取分类列表

- 方法：`GET`
- 路径：`/classify`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNum` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `8` |
| `select` | string | 否 | 传 `true` 时仅返回精选分类 |

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "name": "可爱萌宠",
    "picurl": "https://picsum.photos/id/1025/480/854",
    "sort": 1,
    "select": 1,
    "wallpaper_count": 2,
    "created_at": "2026-03-18T11:47:38.000Z",
    "updated_at": "2026-03-23T12:58:38.000Z",
    "updateTime": "2026-03-23T12:58:38.000Z"
  }
]
```

## 4. 轮播图

### 4.1 获取轮播图列表

- 方法：`GET`
- 路径：`/banner`

### 4.2 获取首页轮播图

- 方法：`GET`
- 路径：`/homeBanner`
- 说明：兼容前端历史命名，返回内容与 `/banner` 一致

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "picurl": "https://example.com/banner.jpg",
    "target": "miniProgram",
    "url": "/pages/classlist/classlist?id=1&name=可爱萌宠",
    "appid": "wx123456"
  }
]
```

## 5. 公告

### 5.1 获取公告列表

- 方法：`GET`
- 路径：`/notice`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

### 5.2 获取公告详情

- 方法：`GET`
- 路径：`/notice/:id`

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 公告 ID |

### 5.3 获取公告列表（前端兼容）

- 方法：`GET`
- 路径：`/wallNewsList`
- 说明：兼容旧前端接口名，返回与 `/notice` 一致

### 5.4 获取公告详情（前端兼容）

- 方法：`GET`
- 路径：`/wallNewsDetail/:id`
- 说明：兼容旧前端接口名，返回与 `/notice/:id` 一致

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "title": "欢迎使用壁纸小程序",
    "content": "<p>公告内容</p>",
    "view_count": 12,
    "created_at": "2026-03-18T11:47:38.000Z",
    "updated_at": "2026-03-18T11:47:38.000Z"
  }
]
```

## 6. 壁纸

### 6.1 获取分类壁纸列表

- 方法：`GET`
- 路径：`/wallList`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `classid` | number | 是 | 分类 ID |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "classid": 1,
    "smallPicurl": "https://picsum.photos/id/1025/480/854",
    "score": "4.8"
  }
]
```

### 6.2 获取壁纸详情

- 方法：`GET`
- 路径：`/detailWall/:id`

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 壁纸 ID |

返回 `data` 字段示例：

```json
{
  "id": 1,
  "_id": 1,
  "classid": 1,
  "smallPicurl": "https://picsum.photos/id/1025/480/854",
  "picurl": "https://picsum.photos/id/1025/1440/2560",
  "score": "4.8",
  "title": "奶油小猫午后",
  "description": "一只蜷在阳光里的奶油小猫，适合作为治愈系手机壁纸。",
  "tabs": ["萌宠", "治愈", "猫咪"],
  "score_count": 36,
  "download_count": 128,
  "view_count": 525,
  "nickname": "咸虾米",
  "status": 1,
  "created_at": "2026-03-23T12:48:58.000Z",
  "updated_at": "2026-03-23T12:52:15.000Z"
}
```

### 6.3 获取每日随机推荐

- 方法：`GET`
- 路径：`/randomWall`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 默认 `9` |

### 6.4 搜索壁纸

- 方法：`GET`
- 路径：`/searchWall`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 是 | 搜索关键词 |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "classid": 1,
    "smallPicurl": "https://picsum.photos/id/1025/480/854",
    "score": "4.8",
    "title": "奶油小猫午后"
  }
]
```

## 7. 用户

### 7.1 获取用户信息

- 方法：`GET`
- 路径：`/userInfo`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 否 | 不传时返回首个用户 |

返回 `data` 字段示例：

```json
{
  "id": 1,
  "nickname": "测试用户",
  "avatar": "",
  "openid": "test_openid_001",
  "IP": "127.0.0.1",
  "address": {
    "country": "本地测试",
    "province": "本地测试",
    "city": "本地测试"
  },
  "scoreSize": 0,
  "downloadSize": 0,
  "score_count": 0,
  "download_count": 0
}
```

### 7.2 壁纸评分

- 方法：`POST`
- 路径：`/setupScore`

请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1,
  "score": 4.5
}
```

说明：

- 当前后端字段名是 `wallpaperId`
- 若前端继续传 `wallId`，需要前端或后端再做一层兼容

成功返回：

```json
{
  "errCode": 0,
  "errMsg": "评分成功",
  "data": {
    "score": 4.5
  },
  "timeCost": 0
}
```

### 7.3 记录下载

- 方法：`POST`
- 路径：`/downloadWall`

请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1
}
```

说明：

- 当前后端字段名是 `wallpaperId`
- 若前端继续传 `wallId`，需要前端或后端再做一层兼容

### 7.4 获取用户历史壁纸

- 方法：`GET`
- 路径：`/userWallList`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 是 | 用户 ID |
| `type` | string | 是 | `score` 或 `download` |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

返回 `data` 字段示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "classid": 1,
    "smallPicurl": "https://picsum.photos/id/1025/480/854",
    "score": "4.8",
    "title": "奶油小猫午后",
    "user_score": 4.5
  }
]
```

## 8. Apifox 录入建议

推荐在 Apifox 中按以下分组创建接口：

- 分类
- 轮播图
- 公告
- 壁纸
- 用户

建议的公共设置：

- 全局环境变量：`baseUrl`、`accessKey`
- 全局请求头：`access-key: {{accessKey}}`
- 默认前缀：`{{baseUrl}}`

## 9. 当前需要注意的兼容点

- 当前返回体里同时保留了 `id` 和 `_id`，用于兼容旧前端
- `/homeBanner`、`/wallNewsList`、`/wallNewsDetail/:id` 都是兼容旧前端的历史接口名
- `setupScore` 和 `downloadWall` 当前文档以实际后端代码为准，使用 `wallpaperId`
- 如果后续你要导出 OpenAPI/Swagger，建议先统一旧字段和历史别名，再做一次规范化
