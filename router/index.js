const express = require('express');
const controller = require('../controllers/users');
const router = express.Router();
const homeController = require('../controllers/home');
router.get('/',homeController.home);
router.use('/user', require('../router/users'));

module.exports = router;


