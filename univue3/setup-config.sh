#!/bin/bash

echo "=========================================="
echo "  澹佺焊灏忕▼搴忓墠鍚庣鍒嗙閰嶇疆鍚戝"
echo "=========================================="
echo ""

# 妫€鏌ユ槸鍚﹀凡瀛樺湪閰嶇疆鏂囦欢
if [ -f "config/env.js" ]; then
    echo "鈿狅笍  妫€娴嬪埌宸插瓨鍦?config/env.js"
    read -p "鏄惁瑕嗙洊? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "鉂?鍙栨秷閰嶇疆"
        exit 0
    fi
fi

# 鍒涘缓閰嶇疆鐩綍
mkdir -p config

# 璇㈤棶閰嶇疆淇℃伅
echo ""
echo "璇疯緭鍏ラ厤缃俊鎭?"
echo ""

# 寮€鍙戠幆澧冮厤缃?echo "銆愬紑鍙戠幆澧冮厤缃€?
read -p "寮€鍙戠幆澧?API 鍦板潃 (榛樿: http://localhost:3000/api): " dev_url
dev_url=${dev_url:-http://localhost:3000/api}

read -p "寮€鍙戠幆澧?Access Key (榛樿: key123456): " dev_key
dev_key=${dev_key:-key123456}

echo ""

# 鐢熶骇鐜閰嶇疆
echo "銆愮敓浜х幆澧冮厤缃€?
read -p "鐢熶骇鐜 API 鍦板潃 (榛樿: https://api.yourdomain.com/api): " prod_url
prod_url=${prod_url:-https://api.yourdomain.com/api}

read -p "鐢熶骇鐜 Access Key (榛樿: your_production_key): " prod_key
prod_key=${prod_key:-your_production_key}

# 鐢熸垚閰嶇疆鏂囦欢
cat > config/env.js << EOF
// 鐜閰嶇疆
const ENV = {
  // 寮€鍙戠幆澧?  development: {
    baseURL: '${dev_url}',
    accessKey: '${dev_key}'
  },
  // 鐢熶骇鐜
  production: {
    baseURL: '${prod_url}',
    accessKey: '${prod_key}'
  }
};

// 褰撳墠鐜
const currentEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// 瀵煎嚭閰嶇疆
export const BASE_URL = ENV[currentEnv].baseURL;
export const ACCESS_KEY = ENV[currentEnv].accessKey;

// 涔熷彲浠ラ€氳繃 URL 鍙傛暟浼犻€?accessKey
export function getAccessKey() {
  // 浼樺厛浣跨敤 URL 鍙傛暟涓殑 accessKey
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;
    if (options && options.accessKey) {
      return options.accessKey;
    }
  }
  return ACCESS_KEY;
}
EOF

echo ""
echo "=========================================="
echo "鉁?閰嶇疆瀹屾垚!"
echo "=========================================="
echo ""
echo "閰嶇疆鏂囦欢宸茬敓鎴? config/env.js"
echo ""
echo "寮€鍙戠幆澧?"
echo "  API 鍦板潃: ${dev_url}"
echo "  Access Key: ${dev_key}"
echo ""
echo "鐢熶骇鐜:"
echo "  API 鍦板潃: ${prod_url}"
echo "  Access Key: ${prod_key}"
echo ""
echo "涓嬩竴姝?"
echo "  1. 鍚姩鍚庣鏈嶅姟: cd ../backend-code && npm run dev"
echo "  2. 浣跨敤 HBuilderX 杩愯鍓嶇椤圭洰"
echo ""

