# API 娴嬭瘯

杩欎唤鏂囨。浠?`../uniappvue3/../uniappvue3/backend-code/src/routes/` 褰撳墠瀹為檯瀹炵幇涓哄噯锛岃€屼笉鏄互鍘嗗彶瑙勫垝鎴栧墠绔崰浣嶆帴鍙ｅ悕涓哄噯銆?
## 1. 鍩虹鍙橀噺

```bash
export API_URL="http://localhost:3000"
export ACCESS_KEY="key123456"
```

## 2. 鍋ュ悍妫€鏌?
```bash
curl "$API_URL/"
```

棰勬湡鍝嶅簲锛?
```json
{"message":"澹佺焊 API 鏈嶅姟杩愯涓?}
```

## 3. 褰撳墠宸插疄鐜版帴鍙?
| 鏂规硶 | 璺緞 | 璇存槑 |
| --- | --- | --- |
| GET | `/api/classify` | 鍒嗙被鍒楄〃 |
| GET | `/api/banner` | 杞挱鍥惧垪琛?|
| GET | `/api/homeBanner` | 杞挱鍥惧垪琛紙鍓嶇鍏煎璺敱锛?|
| GET | `/api/wallList` | 鍒嗙被澹佺焊鍒楄〃 |
| GET | `/api/detailWall/:id` | 澹佺焊璇︽儏 |
| GET | `/api/randomWall` | 闅忔満澹佺焊 |
| GET | `/api/searchWall` | 鎼滅储澹佺焊 |
| GET | `/api/notice` | 鍏憡鍒楄〃 |
| GET | `/api/notice/:id` | 鍏憡璇︽儏 |
| GET | `/api/wallNewsList` | 鍏憡鍒楄〃锛堝墠绔吋瀹硅矾鐢憋級 |
| GET | `/api/wallNewsDetail/:id` | 鍏憡璇︽儏锛堝墠绔吋瀹硅矾鐢憋級 |
| GET | `/api/userInfo` | 鐢ㄦ埛淇℃伅 |
| POST | `/api/setupScore` | 澹佺焊璇勫垎 |
| POST | `/api/downloadWall` | 涓嬭浇璁板綍 |
| GET | `/api/userWallList` | 鐢ㄦ埛鍘嗗彶 |

## 4. curl 绀轰緥

### 鍒嗙被鍒楄〃

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/classify"
```

### 杞挱鍥惧垪琛?
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/banner"
```

### 杞挱鍥惧垪琛紙鍓嶇鍏煎璺敱锛?
```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/homeBanner"
```

### 澹佺焊鍒楄〃

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList?classid=1&limit=10&skip=0"
```

### 澹佺焊璇︽儏

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/detailWall/1"
```

### 闅忔満澹佺焊

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/randomWall?limit=9"
```

### 鎼滅储澹佺焊

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/searchWall?keyword=椋庢櫙&limit=10"
```

### 鍏憡鍒楄〃

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/notice"
```

### 鍏憡璇︽儏

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/notice/1"
```

### 鍏憡鍒楄〃锛堝墠绔吋瀹硅矾鐢憋級

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsList"
```

### 鍏憡璇︽儏锛堝墠绔吋瀹硅矾鐢憋級

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallNewsDetail/1"
```

### 鐢ㄦ埛淇℃伅

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userInfo?userId=1"
```

### 璇勫垎

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1,"score":4.5}' \
  "$API_URL/api/setupScore"
```

### 涓嬭浇璁板綍

```bash
curl -X POST \
  -H "access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"wallpaperId":1}' \
  "$API_URL/api/downloadWall"
```

### 鐢ㄦ埛鍘嗗彶

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/userWallList?userId=1&type=score&limit=10"
```

## 5. 閴存潈涓庨敊璇祴璇?
### 缂哄皯 access-key

```bash
curl "$API_URL/api/classify"
```

### 閿欒鐨?access-key

```bash
curl -H "access-key: wrong_key" "$API_URL/api/classify"
```

### 缂哄皯蹇呭～鍙傛暟

```bash
curl -H "access-key: $ACCESS_KEY" "$API_URL/api/wallList"
```

## 6. 褰撳墠鏈榻愮殑鎺ュ彛

鍓嶇 `api/apis.js` 閲屼娇鐢ㄧ殑鍘嗗彶璺緞宸茬粡鍦ㄥ悗绔ˉ浜嗗吋瀹硅矾鐢憋細

- `/homeBanner`
- `/wallNewsList`
- `/wallNewsDetail/:id`

鐜板湪鍓嶇鑱旇皟鍙互鐩存帴缁х画浣跨敤杩欎簺璺緞锛涘悗绔唴閮ㄥ悓鏃朵繚鐣欎簡 `/banner` 鍜?`/notice` 杩欎竴缁勬洿绠€娲佺殑璺敱銆?

