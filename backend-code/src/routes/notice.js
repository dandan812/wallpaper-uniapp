const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// notices 是当前统一后的主路径。
router.get('/notices', noticeController.getNotices);
router.get('/notices/:id', noticeController.getNoticeDetail);

// notice 是当前标准命名，wallNews* 是旧前端保留下来的兼容路径。
router.get('/notice', noticeController.getNotices);
router.get('/notice/:id', noticeController.getNoticeDetail);
router.get('/wallNewsList', noticeController.getWallNewsList);
router.get('/wallNewsDetail/:id', noticeController.getWallNewsDetail);

module.exports = router;
