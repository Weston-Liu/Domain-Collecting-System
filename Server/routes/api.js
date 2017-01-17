const express = require('express');
const router = express.Router();

router.use('/admin', require('./api-admin'));
router.use('/public', require('./api-public'));

module.exports = router;