const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// 新旧前端首页都可能用到轮播图，因此保留标准路由和历史别名。
router.get('/banner', bannerController.getBanners);
router.get('/homeBanner', bannerController.getHomeBanner);

module.exports = router;
