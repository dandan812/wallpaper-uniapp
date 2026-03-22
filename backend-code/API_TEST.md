# API 测试用例

## 环境变量

```bash
export API_URL="http://localhost:3000"
export ACCESS_KEY="key123456"
```

## 1. 测试根路径

```bash
curl $API_URL/
```

预期响应:
```json
{"message":"壁纸 API 服务运行中"}
```

## 2. 测试分类接口

### 获取所有分类
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"
```

### 获取推荐分类
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify?select=1"
```

## 3. 测试轮播图接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/homeBanner"
```

## 4. 测试壁纸列表接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList?classid=1&limit=10&skip=0"
```

## 5. 测试壁纸详情接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/detailWall/1"
```

## 6. 测试随机壁纸接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/randomWall?limit=9"
```

## 7. 测试搜索接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/searchWall?keyword=风景&limit=10"
```

## 8. 测试公告列表接口

### 获取所有公告
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsList"
```

### 获取置顶公告
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsList?select=1"
```

## 9. 测试公告详情接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsDetail/1"
```

## 10. 测试用户信息接口

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userInfo?userId=1"
```

## 11. 测试评分接口

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1,"score":4.5}' \
  "$API_URL/api/setupScore"
```

## 12. 测试下载记录接口

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1}' \
  "$API_URL/api/downloadWall"
```

## 13. 测试用户评分历史

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userWallList?userId=1&type=score&limit=10"
```

## 14. 测试用户下载历史

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userWallList?userId=1&type=download&limit=10"
```

## 错误测试

### 缺少 access-key
```bash
curl "$API_URL/api/classify"
```

预期响应:
```json
{"errCode":401,"errMsg":"缺少 access-key","data":null}
```

### 错误的 access-key
```bash
curl -H "access-key: wrong_key" "$API_URL/api/classify"
```

预期响应:
```json
{"errCode":401,"errMsg":"无效的 access-key","data":null}
```

### 缺少必填参数
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList"
```

预期响应:
```json
{"errCode":400,"errMsg":"缺少分类ID","data":null}
```

## 性能测试

使用 Apache Bench 进行压力测试:

```bash
# 测试分类接口 (1000请求, 10并发)
ab -n 1000 -c 10 -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"

# 测试壁纸列表接口
ab -n 1000 -c 10 -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList?classid=1"
```

## 缓存测试

### 第一次请求 (无缓存)
```bash
time curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"
```

### 第二次请求 (有缓存)
```bash
time curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"
```

第二次应该明显更快。
