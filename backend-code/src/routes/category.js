const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/classify', categoryController.getClassify);

module.exports = router;
