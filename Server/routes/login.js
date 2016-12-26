var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    if (req.session.role === undefined)
        res.render('login');
    else
        res.redirect('/');
});

module.exports = router;