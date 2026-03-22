// 环境配置示例
// 复制此文件为 env.js 并修改配置

const ENV = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:3000/api',
    accessKey: 'key123456'
  },
  // 生产环境
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    accessKey: 'your_production_key'
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
