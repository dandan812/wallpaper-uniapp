# Apifox接口清单

这份文档以当前项目的实际后端实现为准，适合作为 Apifox 手动录入说明和接口核对清单。

如果你想直接导入 Apifox，优先使用：

- [Apifox导入.json](C:/Users/hulian/Desktop/huliang/bizi/univue3/docs/reference/Apifox导入.json)

当前可用环境：

- 线上：`http://8.135.46.112/api`
- 本地：`http://localhost:3000/api`

## 1. Apifox 环境变量建议

建议先在 Apifox 中配置：

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

- 所有 `/api/*` 接口都需要 `access-key`
- 当前后端也兼容通过查询参数 `accessKey` 传递，但不建议继续使用

## 2. 公共返回结构

成功示例：

```json
{
  "errCode": 0,
  "errMsg": "查询成功",
  "data": {},
  "timeCost": 0,
  "total": 0
}
```

失败示例：

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
- `400`：参数错误或业务校验失败
- `401`：`access-key` 无效
- `404`：资源不存在

## 3. 分类

### 3.1 获取分类列表

- 方法：`GET`
- 路径：`/classify`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 推荐使用，默认 `8` |
| `skip` | number | 否 | 推荐使用，默认 `0` |
| `pageNum` | number | 否 | 旧参数，默认 `1` |
| `pageSize` | number | 否 | 旧参数，默认 `8` |
| `select` | string | 否 | 传 `true` 时仅返回精选分类 |

说明：

- 当前后端已经支持 `limit + skip`
- 旧分页参数 `pageNum + pageSize` 仍兼容
- 返回中同时保留 `id` 和 `_id`

返回 `data` 示例：

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

说明：

- `/homeBanner` 是前端历史兼容别名
- 当前返回内容与 `/banner` 一致

返回 `data` 示例：

```json
[
  {
    "id": 1,
    "_id": 1,
    "picurl": "https://picsum.photos/id/1015/960/540",
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

### 5.3 获取公告列表（兼容旧前端）

- 方法：`GET`
- 路径：`/wallNewsList`

说明：

- 这是旧前端接口别名
- 当前返回内容与 `/notice` 一致

### 5.4 获取公告详情（兼容旧前端）

- 方法：`GET`
- 路径：`/wallNewsDetail/:id`

说明：

- 这是旧前端接口别名
- 当前返回内容与 `/notice/:id` 一致

返回 `data` 示例：

```json
{
  "id": 1,
  "_id": 1,
  "title": "欢迎使用壁纸小程序",
  "content": "<p>公告内容</p>",
  "view_count": 12,
  "created_at": "2026-03-18T11:47:38.000Z",
  "updated_at": "2026-03-18T11:47:38.000Z"
}
```

## 6. 壁纸

### 6.1 获取分类壁纸列表

- 方法：`GET`
- 路径：`/wallList`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `classid` | number | 是 | 分类 ID |
| `limit` | number | 否 | 推荐使用，默认 `10` |
| `skip` | number | 否 | 推荐使用，默认 `0` |
| `pageNum` | number | 否 | 旧参数，默认 `1` |
| `pageSize` | number | 否 | 旧参数，默认 `10` |

说明：

- 当前建议统一使用 `limit + skip`
- 旧分页参数仍兼容

返回 `data` 示例：

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

返回 `data` 示例：

```json
{
  "id": 1,
  "_id": 1,
  "classid": 1,
  "smallPicurl": "https://picsum.photos/id/1025/480/854",
  "picurl": "https://picsum.photos/id/1025/1440/2560",
  "score": "4.8",
  "title": "奶油小猫午后",
  "description": "一张适合作为手机壁纸的演示图片。",
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

### 6.3 获取每日推荐

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
| `limit` | number | 否 | 推荐使用，默认 `10` |
| `skip` | number | 否 | 推荐使用，默认 `0` |
| `pageNum` | number | 否 | 旧参数，默认 `1` |
| `pageSize` | number | 否 | 旧参数，默认 `10` |

说明：

- 当前建议统一使用 `limit + skip`
- 旧分页参数仍兼容

返回 `data` 示例：

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
| `userId` | number | 否 | 不传时回退到首个用户 |

说明：

- 当前前端未接入真实登录态
- 所以未传 `userId` 时，后端会回退到首个用户并返回默认统计信息

返回 `data` 示例：

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

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1,
  "score": 4.5
}
```

兼容说明：

- 当前标准字段是 `wallpaperId`
- 当前标准评分字段是 `score`
- 旧字段 `wallId` 和 `userScore` 仍兼容

成功示例：

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

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1
}
```

兼容说明：

- 当前标准字段是 `wallpaperId`
- 旧字段 `wallId` 仍兼容

### 7.4 获取用户历史壁纸

- 方法：`GET`
- 路径：`/userWallList`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 是 | `score` 或 `download` |
| `userId` | number | 否 | 不传时回退到首个用户 |
| `limit` | number | 否 | 推荐使用，默认 `10` |
| `skip` | number | 否 | 推荐使用，默认 `0` |
| `pageNum` | number | 否 | 旧参数，默认 `1` |
| `pageSize` | number | 否 | 旧参数，默认 `10` |

说明：

- 当前建议统一使用 `limit + skip`
- 未传 `userId` 时也会回退到首个用户
- 旧分页参数仍兼容

返回 `data` 示例：

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

## 8. 当前统一规则

现在建议前后端统一按这套字段使用：

- 壁纸主键参数：`wallpaperId`
- 评分字段：`score`
- 分页参数：`limit`、`skip`
- 实体主键读取：优先 `id`

当前后端仍保留兼容：

- `wallId`
- `userScore`
- `pageNum`
- `pageSize`
- `_id`

## 9. Apifox 录入建议

建议在 Apifox 里按以下分组创建接口：

- 分类
- 轮播图
- 公告
- 壁纸
- 用户

建议公共设置：

- 全局环境变量：`baseUrl`、`accessKey`
- 全局请求头：`access-key: {{accessKey}}`
- 默认前缀：`{{baseUrl}}`

## 10. 当前线上状态备注

截至 `2026-03-24`，这份文档已经和当前线上后端一致，包括：

- `/homeBanner`、`/wallNewsList`、`/wallNewsDetail/:id` 已兼容
- `userInfo` 未传 `userId` 不再报错
- `setupScore`、`downloadWall` 已兼容旧参数
- 返回里仍保留 `id` 和 `_id`
- 前端 H5 已重新发行并部署到 `http://8.135.46.112`
