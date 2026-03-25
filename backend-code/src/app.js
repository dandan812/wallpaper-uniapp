const express = require('express');
const cors = require('cors');
// 执行后，这些env值就会进入：
// process.env 这个对象里，后续就可以通过 process.env.VARIABLE_NAME 来访问这些环境变量了。
require('dotenv').config();
require('./models');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const accessKeyMiddleware = require('./middlewares/accessKey');
const categoryRoutes = require('./routes/category');
const bannerRoutes = require('./routes/banner');
const wallpaperRoutes = require('./routes/wallpaper');
const noticeRoutes = require('./routes/notice');
const userRoutes = require('./routes/user');

const app = express();

// 入口层只挂载通用中间件，业务逻辑尽量下沉到 routes/controllers 中。

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// 所有 API 都先经过 access-key 校验，避免每个路由重复写鉴权逻辑。
app.use('/api', accessKeyMiddleware);
app.use('/api', categoryRoutes);
app.use('/api', bannerRoutes);
app.use('/api', wallpaperRoutes);
app.use('/api', noticeRoutes);
app.use('/api', userRoutes);

// 根路径通常给部署探活或人工快速确认服务是否存活使用。
app.get('/', (req, res) => {
  res.json({ message: '壁纸 API 服务运行中' });
});

// 放在所有路由之后，负责接住前面抛出的未处理异常。
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ 服务器运行在端口 ${PORT}`);
});

module.exports = app;
