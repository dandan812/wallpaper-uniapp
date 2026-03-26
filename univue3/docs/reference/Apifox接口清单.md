# Apifox接口清单

这份文档以当前代码实现为准，主接口统一使用新路径；旧路径只作为兼容别名保留在后端，不再作为前端和文档主入口。

如果需要直接导入 Apifox，请使用：

- [Apifox导入.json](C:/Users/hulian/Desktop/huliang/bizi/uniappvue3/univue3/docs/reference/Apifox导入.json)

当前环境：

- 线上：`http://8.135.46.112/api`
- 本地：`http://localhost:3000/api`

## 1. Apifox 环境变量

建议配置：

```text
baseUrl = http://8.135.46.112/api
accessKey = key123456
```

公共请求头：

```http
access-key: {{accessKey}}
Content-Type: application/json
```

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

## 3. 当前统一规则

当前前后端统一按这套规则使用：

- 轮播图：`/banners`
- 分类：`/categories`
- 公告：`/notices`、`/notices/:id`
- 壁纸：`/wallpapers`、`/wallpapers/:id`、`/wallpapers/random`、`/wallpapers/search`
- 用户：`/users/me`、`/users/wallpapers`
- 评分：`POST /wallpapers/score`
- 下载：`POST /wallpapers/download`
- 分页参数：`limit`、`skip`
- 壁纸主键参数：`wallpaperId`
- 评分字段：`score`
- 实体主键读取：优先 `id`

后端仍保留兼容：

- `/_id`
- `user_score`
- `/banner`、`/homeBanner`
- `/classify`
- `/notice`、`/wallNewsList`、`/wallNewsDetail/:id`
- `/wallList`、`/detailWall/:id`、`/randomWall`、`/searchWall`
- `/userInfo`、`/userWallList`
- `/setupScore`、`/downloadWall`
- 旧参数 `wallId`、`userScore`

## 4. 分类

### 4.1 获取分类列表

- 方法：`GET`
- 路径：`/categories`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 默认 `8` |
| `skip` | number | 否 | 默认 `0` |
| `select` | string | 否 | 传 `true` 时仅返回精选分类 |

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
    "wallpaper_count": 30,
    "updateTime": "2026-03-26T05:58:13.000Z"
  }
]
```

## 5. 轮播图

### 5.1 获取轮播图列表

- 方法：`GET`
- 路径：`/banners`

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

## 6. 公告

### 6.1 获取公告列表

- 方法：`GET`
- 路径：`/notices`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |
| `select` | string | 否 | 传 `true` 时仅返回置顶公告 |

### 6.2 获取公告详情

- 方法：`GET`
- 路径：`/notices/:id`

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 公告 ID |

返回 `data` 示例：

```json
{
  "id": 1,
  "_id": 1,
  "title": "欢迎使用壁纸小程序",
  "content": "<p>公告内容</p>",
  "view_count": 12,
  "publish_date": "2026-03-18T11:47:38.000Z"
}
```

## 7. 壁纸

### 7.1 获取壁纸列表

- 方法：`GET`
- 路径：`/wallpapers`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `classid` | number | 是 | 分类 ID |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

### 7.2 获取壁纸详情

- 方法：`GET`
- 路径：`/wallpapers/:id`

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 壁纸 ID |

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 否 | 不传时回退到首个用户 |

返回 `data` 示例：

```json
{
  "id": 1,
  "_id": 1,
  "classid": 1,
  "smallPicurl": "https://picsum.photos/id/1025/480/854",
  "picurl": "https://picsum.photos/id/1025/1440/2560",
  "score": "4.5",
  "title": "奶油小猫午后",
  "description": "一张适合作为手机壁纸的演示图片。",
  "tabs": ["萌宠", "治愈", "猫咪"],
  "nickname": "咸虾米",
  "userScore": 4.5,
  "user_score": 4.5
}
```

### 7.3 获取随机壁纸

- 方法：`GET`
- 路径：`/wallpapers/random`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 默认 `9` |

### 7.4 搜索壁纸

- 方法：`GET`
- 路径：`/wallpapers/search`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 是 | 搜索关键词 |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

## 8. 用户

### 8.1 获取当前用户信息

- 方法：`GET`
- 路径：`/users/me`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 否 | 不传时回退到首个用户 |

### 8.2 提交壁纸评分

- 方法：`POST`
- 路径：`/wallpapers/score`

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1,
  "score": 4.5
}
```

返回 `data` 示例：

```json
{
  "userScore": 4.5,
  "score": 4.6,
  "scoreCount": 7,
  "updated": true
}
```

### 8.3 记录下载

- 方法：`POST`
- 路径：`/wallpapers/download`

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1
}
```

### 8.4 获取用户历史壁纸

- 方法：`GET`
- 路径：`/users/wallpapers`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 是 | `score` 或 `download` |
| `userId` | number | 否 | 不传时回退到首个用户 |
| `limit` | number | 否 | 默认 `10` |
| `skip` | number | 否 | 默认 `0` |

## 9. 兼容别名对照

| 当前主路径 | 旧兼容路径 |
| --- | --- |
| `/banners` | `/banner`、`/homeBanner` |
| `/categories` | `/classify` |
| `/notices` | `/notice`、`/wallNewsList` |
| `/notices/:id` | `/notice/:id`、`/wallNewsDetail/:id` |
| `/wallpapers` | `/wallList` |
| `/wallpapers/:id` | `/detailWall/:id` |
| `/wallpapers/random` | `/randomWall` |
| `/wallpapers/search` | `/searchWall` |
| `/users/me` | `/userInfo` |
| `/users/wallpapers` | `/userWallList` |
| `POST /wallpapers/score` | `POST /setupScore` |
| `POST /wallpapers/download` | `POST /downloadWall` |

## 10. 当前状态

截至 `2026-03-26`，这份文档和当前代码一致：

- 前端主调用已改成新路径
- 后端仍保留旧路径兼容
- 文档主路径已切到新接口命名
- Apifox 导入文件已同步更新
