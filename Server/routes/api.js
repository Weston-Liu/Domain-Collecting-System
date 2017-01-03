//var database = require('../db.js');
var express = require('express');
var router = express.Router();

router.use('/admin', require('./api-admin'));
router.use('/public', require('./api-public'));

module.exports = router;