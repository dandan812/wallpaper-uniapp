const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/userInfo', userController.getUserInfo);
router.post('/setupScore', userController.setupScore);
router.post('/downloadWall', userController.downloadWall);
router.get('/userWallList', userController.getUserWallList);

module.exports = router;
