const express = require('express');
const router = express.Router();
const wallpaperController = require('../controllers/wallpaperController');

router.get('/wallpaper', wallpaperController.getWallpapers);
router.get('/wallpaper/:id', wallpaperController.getWallpaperDetail);

module.exports = router;
