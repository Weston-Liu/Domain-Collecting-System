const path = require('path');
const fs = require('fs');
const database = require('./db.js');
const express = require('express');
const app = express();
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const minifyHTML = require('express-minify-html');
// dev-use-only
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const reload = require('reload');
const http = require('http');


// statics
app.use(express.static('./public'));

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

// dev-use-only
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

// session
app.use(session({
    name: 'passport',
    secret: 'RIVEN',
    resave: false,
    store: new MySQLStore(require('./config.js')),
    saveUninitialized: true
}));


// routes
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/api', require('./routes/api'));

var server = http.createServer(app);
reload(server, app);

server.listen(8888, function () {
    console.log('App (dev) is now running on port 8888!');
});

/*
var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Now the app is listening at port ${port}`);
});*/