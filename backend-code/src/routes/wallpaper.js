const express = require('express');
const router = express.Router();
const wallpaperController = require('../controllers/wallpaperController');

router.get('/wallList', wallpaperController.getWallpapers);
router.get('/detailWall/:id', wallpaperController.getWallpaperDetail);
router.get('/randomWall', wallpaperController.getRandomWallpapers);
router.get('/searchWall', wallpaperController.searchWallpapers);

module.exports = router;
