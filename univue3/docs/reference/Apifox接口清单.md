# Apifox接口清单

这份文档以当前代码实现为准，只记录当前主路径。

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

后端仍保留部分旧路径和旧参数兼容，但不再列入当前文档。

## 4. 分类

### 4.1 获取分类列表

- 方法：`GET`
- 路径：`/categories`
- 作用：获取分类列表，首页专题区和分类页会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 本次最多返回多少个分类，可以理解为“每页几条”，默认 `8` |
| `skip` | number | 否 | 跳过前面多少个分类，常用于分页；第一页通常传 `0` |
| `select` | string | 否 | 传 `true` 时只返回首页“专题精选”要展示的分类 |

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
- 作用：获取首页轮播图列表

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
- 作用：获取公告列表，首页公告区和公告页会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 本次最多返回多少条公告，默认 `10` |
| `skip` | number | 否 | 跳过前面多少条公告，常用于分页；第一页通常传 `0` |
| `select` | string | 否 | 传 `true` 时只返回置顶公告 |

### 6.2 获取公告详情

- 方法：`GET`
- 路径：`/notices/:id`
- 作用：获取单条公告详情

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 公告主键 ID。这个值来自 `/notices` 列表返回结果里的 `id` |

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
- 作用：按分类获取壁纸列表，分类列表页会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `classid` | number | 是 | 分类 ID，表示要看哪个分类下的壁纸。这个值来自 `/categories` 返回结果里的 `id` |
| `limit` | number | 否 | 本次最多返回多少张壁纸，可以理解为“每页几张”，默认 `10` |
| `skip` | number | 否 | 跳过前面多少张壁纸，常用于分页或加载更多；第一页通常传 `0` |

### 7.2 获取壁纸详情

- 方法：`GET`
- 路径：`/wallpapers/:id`
- 作用：获取单张壁纸详情，预览页会调用

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 壁纸 ID，表示要查看哪一张壁纸。这个值来自 `/wallpapers` 列表返回结果里的 `id` |

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 否 | 当前用户 ID。传了以后接口会顺便返回这位用户是否给这张壁纸评过分；不传时回退到默认用户 |

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
- 作用：随机获取一批壁纸，首页“每日推荐”会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 本次随机返回多少张壁纸，首页“每日推荐”这类场景会用到，默认 `9` |

### 7.4 搜索壁纸

- 方法：`GET`
- 路径：`/wallpapers/search`
- 作用：按关键词搜索壁纸，搜索页会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 是 | 搜索关键词，后端会根据标题、描述、标签等字段模糊匹配 |
| `limit` | number | 否 | 本次最多返回多少条搜索结果，默认 `10` |
| `skip` | number | 否 | 跳过前面多少条搜索结果，做分页或继续加载时使用 |

## 8. 用户

### 8.1 获取当前用户信息

- 方法：`GET`
- 路径：`/users/me`
- 作用：获取当前用户信息，我的页面会调用

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 否 | 当前用户 ID。一般不传也能用，后端会回退到默认用户；需要指定某个用户时再传 |

### 8.2 提交壁纸评分

- 方法：`POST`
- 路径：`/wallpapers/score`
- 作用：提交壁纸评分；同一用户可以重复评分，后一次会覆盖前一次

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1,
  "score": 4.5
}
```

参数说明：

- `userId`：当前用户 ID，一般传 `1` 即可
- `wallpaperId`：壁纸 ID，表示给哪一张壁纸评分，这个值来自壁纸列表或壁纸详情接口
- `score`：打分值，支持半分，例如 `4`、`4.5`、`5`

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
- 作用：记录一次下载行为，用于“我的下载”历史

推荐请求体：

```json
{
  "userId": 1,
  "wallpaperId": 1
}
```

参数说明：

- `userId`：当前用户 ID，一般传 `1` 即可
- `wallpaperId`：壁纸 ID，表示下载的是哪一张壁纸

### 8.4 获取用户历史壁纸

- 方法：`GET`
- 路径：`/users/wallpapers`
- 作用：获取用户历史壁纸列表，包括“我的评分”和“我的下载”

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 是 | 要查哪种历史记录。`score` 表示“我的评分”，`download` 表示“我的下载” |
| `userId` | number | 否 | 当前用户 ID。不传时后端会回退到默认用户 |
| `limit` | number | 否 | 本次最多返回多少条历史记录，默认 `10` |
| `skip` | number | 否 | 跳过前面多少条历史记录，用于分页 |

## 9. 当前状态

截至 `2026-03-26`，这份文档和当前代码一致：

- 前端主调用已改成新路径
- 后端仍保留旧路径兼容
- 文档主路径已切到新接口命名
- Apifox 导入文件已同步更新
