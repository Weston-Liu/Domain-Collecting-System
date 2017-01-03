const path = require('path');
const fs = require('fs');
const database = require('./db.js');
const express = require('express');
const app = express();
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const minifyHTML = require('express-minify-html');
const compression = require('compression')


// dev-use-only
if (process.env.NODE_ENV !== 'production') {

    var webpack = require('webpack');
    var webpackConfig = require('../webpack.config');
    var compiler = webpack(webpackConfig);
    var reload = require('reload');
    var http = require('http');

    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(compiler));
} else {

    // statics
    app.use(express.static(path.join(__dirname, 'public')));
}

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
app.use(compression());


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


// dev-use-only
if (process.env.NODE_ENV !== 'production') {

    var server = http.createServer(app);
    reload(server, app);
    server.listen(8888, function () {
        console.log('App (dev) is now running on port 8888!');
    });

} else {
    const server = app.listen(8888, function () {
        console.log(`Now the app is listening at port ${server.address().port}`);
    });
}