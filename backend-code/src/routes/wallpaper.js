const express = require('express');
const router = express.Router();
const wallpaperController = require('../controllers/wallpaperController');

// wallpapers 是当前统一后的主路径。
// 具体子路径要放在 :id 前面，避免 random/search 被当成 id 截走。
router.get('/wallpapers', wallpaperController.getWallpapers);
router.get('/wallpapers/random', wallpaperController.getRandomWallpapers);
router.get('/wallpapers/search', wallpaperController.searchWallpapers);
router.get('/wallpapers/:id', wallpaperController.getWallpaperDetail);

// 壁纸路由覆盖列表、详情、推荐和搜索，是前端访问最频繁的一组接口。
router.get('/wallList', wallpaperController.getWallpapers);
router.get('/detailWall/:id', wallpaperController.getWallpaperDetail);
router.get('/randomWall', wallpaperController.getRandomWallpapers);
router.get('/searchWall', wallpaperController.searchWallpapers);

module.exports = router;
