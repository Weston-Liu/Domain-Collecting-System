const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {

    if (req.session.role === 1)
        res.render('index');
    else if (req.session.role === 9)
        res.render('admin');
    else
        res.redirect('/login');
});

module.exports = router;