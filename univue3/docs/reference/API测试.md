# API 测试

这份文档以当前代码实现为准，示例全部使用新主路径。

## 基础变量

```bash
export API_URL="http://localhost:3000/api"
export ACCESS_KEY="key123456"
```

## 健康检查

```bash
curl "http://localhost:3000/"
```

预期响应：

```json
{"message":"壁纸 API 服务运行中"}
```

## 当前主接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/banners` | 轮播图列表 |
| GET | `/api/notices` | 公告列表 |
| GET | `/api/notices/:id` | 公告详情 |
| GET | `/api/wallpapers` | 壁纸列表 |
| GET | `/api/wallpapers/:id` | 壁纸详情 |
| GET | `/api/wallpapers/random` | 随机壁纸 |
| GET | `/api/wallpapers/search` | 搜索壁纸 |
| GET | `/api/users/me` | 用户信息 |
| POST | `/api/wallpapers/score` | 壁纸评分 |
| POST | `/api/wallpapers/download` | 下载记录 |
| GET | `/api/users/wallpapers` | 用户历史 |

## curl 示例

### 分类列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/categories?limit=8&skip=0"
```

### 轮播图列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/banners"
```

### 公告列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/notices?limit=10&skip=0"
```

### 公告详情

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/notices/1"
```

### 壁纸列表

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/wallpapers?classid=1&limit=10&skip=0"
```

### 壁纸详情

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/wallpapers/1"
```

### 随机壁纸

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/wallpapers/random?limit=9"
```

### 搜索壁纸

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/wallpapers/search?keyword=风景&limit=10&skip=0"
```

### 用户信息

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/users/me?userId=1"
```

### 评分

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1,"score":4.5}' \
  "$API_URL/wallpapers/score"
```

### 下载记录

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1}' \
  "$API_URL/wallpapers/download"
```

### 用户历史

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/users/wallpapers?userId=1&type=score&limit=10&skip=0"
```

## 鉴权与错误测试

### 缺少 access-key

```bash
curl "$API_URL/categories"
```

### 错误的 access-key

```bash
curl -H "access-key: wrong_key" "$API_URL/categories"
```

### 缺少必填参数

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/wallpapers"
```
