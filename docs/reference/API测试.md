# API 测试

这份文档以 `backend-code/src/routes/` 当前实际实现为准，而不是以历史规划或前端占位接口名为准。

## 1. 基础变量

```bash
export API_URL="http://localhost:3000"
export ACCESS_KEY="key123456"
```

## 2. 健康检查

```bash
curl "$API_URL/"
```

预期响应：

```json
{"message":"壁纸 API 服务运行中"}
```

## 3. 当前已实现接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/classify` | 分类列表 |
| GET | `/api/banner` | 轮播图列表 |
| GET | `/api/homeBanner` | 轮播图列表（前端兼容路由） |
| GET | `/api/wallList` | 分类壁纸列表 |
| GET | `/api/detailWall/:id` | 壁纸详情 |
| GET | `/api/randomWall` | 随机壁纸 |
| GET | `/api/searchWall` | 搜索壁纸 |
| GET | `/api/notice` | 公告列表 |
| GET | `/api/notice/:id` | 公告详情 |
| GET | `/api/wallNewsList` | 公告列表（前端兼容路由） |
| GET | `/api/wallNewsDetail/:id` | 公告详情（前端兼容路由） |
| GET | `/api/userInfo` | 用户信息 |
| POST | `/api/setupScore` | 壁纸评分 |
| POST | `/api/downloadWall` | 下载记录 |
| GET | `/api/userWallList` | 用户历史 |

## 4. curl 示例

### 分类列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"
```

### 轮播图列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/banner"
```

### 轮播图列表（前端兼容路由）

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/homeBanner"
```

### 壁纸列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList?classid=1&limit=10&skip=0"
```

### 壁纸详情

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/detailWall/1"
```

### 随机壁纸

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/randomWall?limit=9"
```

### 搜索壁纸

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/searchWall?keyword=风景&limit=10"
```

### 公告列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/notice"
```

### 公告详情

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/notice/1"
```

### 公告列表（前端兼容路由）

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsList"
```

### 公告详情（前端兼容路由）

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsDetail/1"
```

### 用户信息

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userInfo?userId=1"
```

### 评分

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1,"score":4.5}' \
  "$API_URL/api/setupScore"
```

### 下载记录

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1}' \
  "$API_URL/api/downloadWall"
```

### 用户历史

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userWallList?userId=1&type=score&limit=10"
```

## 5. 鉴权与错误测试

### 缺少 access-key

```bash
curl "$API_URL/api/classify"
```

### 错误的 access-key

```bash
curl -H "access-key: wrong_key" "$API_URL/api/classify"
```

### 缺少必填参数

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList"
```

## 6. 当前未对齐的接口

前端 `api/apis.js` 里使用的历史路径已经在后端补了兼容路由：

- `/homeBanner`
- `/wallNewsList`
- `/wallNewsDetail/:id`

现在前端联调可以直接继续使用这些路径；后端内部同时保留了 `/banner` 和 `/notice` 这一组更简洁的路由。
