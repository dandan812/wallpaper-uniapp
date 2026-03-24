const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

router.get('/notice', noticeController.getNotices);
router.get('/notice/:id', noticeController.getNoticeDetail);
router.get('/wallNewsList', noticeController.getWallNewsList);
router.get('/wallNewsDetail/:id', noticeController.getWallNewsDetail);

module.exports = router;
