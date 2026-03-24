const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// 分类接口主要给首页专题、分类页和筛选面板使用。
router.get('/classify', categoryController.getClassify);

module.exports = router;
