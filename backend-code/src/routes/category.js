const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// categories 是当前统一后的主路径。
router.get('/categories', categoryController.getClassify);

// 分类接口主要给首页专题、分类页和筛选面板使用。
router.get('/classify', categoryController.getClassify);

module.exports = router;
