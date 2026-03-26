const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// users/* 是当前统一后的主路径。
router.get('/users/me', userController.getUserInfo);
router.post('/wallpapers/score', userController.setupScore);
router.post('/wallpapers/download', userController.downloadWall);
router.get('/users/wallpapers', userController.getUserWallList);

// 用户相关接口既服务个人页，也承载评分/下载等交互写入。
router.get('/userInfo', userController.getUserInfo);
router.post('/setupScore', userController.setupScore);
router.post('/downloadWall', userController.downloadWall);
router.get('/userWallList', userController.getUserWallList);

module.exports = router;
