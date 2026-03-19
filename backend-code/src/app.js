const express = require('express');
const cors = require('cors');
require('dotenv').config();

const accessKeyMiddleware = require('./middlewares/accessKey');
const categoryRoutes = require('./routes/category');
const bannerRoutes = require('./routes/banner');
const wallpaperRoutes = require('./routes/wallpaper');
const noticeRoutes = require('./routes/notice');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', accessKeyMiddleware);
app.use('/api', categoryRoutes);
app.use('/api', bannerRoutes);
app.use('/api', wallpaperRoutes);
app.use('/api', noticeRoutes);

app.get('/', (req, res) => {
  res.json({ message: '壁纸 API 服务运行中' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ 服务器运行在端口 ${PORT}`);
});

module.exports = app;
