#!/bin/bash

echo "=========================================="
echo "  壁纸小程序前后端分离配置向导"
echo "=========================================="
echo ""

# 检查是否已存在配置文件
if [ -f "config/env.js" ]; then
    echo "⚠️  检测到已存在 config/env.js"
    read -p "是否覆盖? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "❌ 取消配置"
        exit 0
    fi
fi

# 创建配置目录
mkdir -p config

# 询问配置信息
echo ""
echo "请输入配置信息:"
echo ""

# 开发环境配置
echo "【开发环境配置】"
read -p "开发环境 API 地址 (默认: http://localhost:3000/api): " dev_url
dev_url=${dev_url:-http://localhost:3000/api}

read -p "开发环境 Access Key (默认: key123456): " dev_key
dev_key=${dev_key:-key123456}

echo ""

# 生产环境配置
echo "【生产环境配置】"
read -p "生产环境 API 地址 (默认: https://api.yourdomain.com/api): " prod_url
prod_url=${prod_url:-https://api.yourdomain.com/api}

read -p "生产环境 Access Key (默认: your_production_key): " prod_key
prod_key=${prod_key:-your_production_key}

# 生成配置文件
cat > config/env.js << EOF
// 环境配置
const ENV = {
  // 开发环境
  development: {
    baseURL: '${dev_url}',
    accessKey: '${dev_key}'
  },
  // 生产环境
  production: {
    baseURL: '${prod_url}',
    accessKey: '${prod_key}'
  }
};

// 当前环境
const currentEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// 导出配置
export const BASE_URL = ENV[currentEnv].baseURL;
export const ACCESS_KEY = ENV[currentEnv].accessKey;

// 也可以通过 URL 参数传递 accessKey
export function getAccessKey() {
  // 优先使用 URL 参数中的 accessKey
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
echo "✅ 配置完成!"
echo "=========================================="
echo ""
echo "配置文件已生成: config/env.js"
echo ""
echo "开发环境:"
echo "  API 地址: ${dev_url}"
echo "  Access Key: ${dev_key}"
echo ""
echo "生产环境:"
echo "  API 地址: ${prod_url}"
echo "  Access Key: ${prod_key}"
echo ""
echo "下一步:"
echo "  1. 启动后端服务: cd backend-code && npm run dev"
echo "  2. 使用 HBuilderX 运行前端项目"
echo ""
