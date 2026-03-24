const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/banner', bannerController.getBanners);
router.get('/homeBanner', bannerController.getHomeBanner);

module.exports = router;
