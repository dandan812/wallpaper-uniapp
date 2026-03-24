const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// notice 是当前标准命名，wallNews* 是旧前端保留下来的兼容路径。
router.get('/notice', noticeController.getNotices);
router.get('/notice/:id', noticeController.getNoticeDetail);
router.get('/wallNewsList', noticeController.getWallNewsList);
router.get('/wallNewsDetail/:id', noticeController.getWallNewsDetail);

module.exports = router;
