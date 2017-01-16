var database = require('../db.js');
var fs = require('fs');
var path = require('path');
var express = require('express');
var xlsx = require('node-xlsx');
var router = express.Router();
const md5 = require('md5');
var DB = new database();

/**********************************************************************************************************/
//                                          Info
/**********************************************************************************************************/

router.get('/info', function (req, res) {
    res.json({
        name: req.session.name,
        country: req.session.country,
        sites: req.session.sites
    });
});

/**********************************************************************************************************/
//                                          Domain
/**********************************************************************************************************/

/**
 * @param: site [int], domain [string]
 * @returns: 200 / 500
 */
router.put('/domain', function (req, res) {

    var date = new Date();
    var ds = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    var sql = 'INSERT IGNORE INTO `data` (`site`, `domain`, applicant, `createTime`, `viewTime`) VALUES ';

    var sites = req.body.sites;
    var domains = req.body.domains;
    var plain = [];
    var params = [];

    if (domains.length === 0) {
        res.sendStatus(200);
        return;
    }

    for (let site of sites) {
        for (let domain of domains) {
            plain.push('(?, ?, ?, ?, ?)');
            params = params.concat([site, domain, req.session.uid, ds, ds]);
        }
    }

    sql = sql + plain.join(',');

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/**
 * @version: 2.0 
 * @returns:  [{}.. [object]]
 */
router.get('/domain', function (req, res) {
    var sql = "SELECT \
        site.id AS sid, \
        site.name AS site, \
        data.domain AS domain, \
        data.createTime AS cTime, \
        data.viewTime AS vTime, \
        user.name AS applicant \
        FROM \
        `data` \
        INNER JOIN site ON site.id = data.site \
        INNER JOIN user ON user.id = data.applicant \
        WHERE user.country = ? \
        ORDER BY cTime";

    DB.connection.query(sql, [req.session.cid], (err, results, fields) => {
        err && console.log(err);
        res.json(results);
    });
});

/*********************************************************************************************************/
//                                          Login / Logout
/*********************************************************************************************************/

/**
 * @version: 2.0 
 * @param: name [string], password [string]
 * @returns: 302
 */
router.post('/login', function (req, res) {

    var authentication = new Promise((resolve, reject) => {
        var sql = 'SELECT user.id AS id, \
            user.name AS name, \
            user.password AS password, \
            user.role AS role, \
            user.salt AS salt, \
            country.id AS cid, \
            country.name AS country \
            FROM `user` INNER JOIN `country` ON user.country = country.id \
            WHERE user.name = ?';

        var params = [req.body.u];

        DB.connection.query(sql, params, (err, results, fields) => {
            if (err) {
                reject(err);
                res.sendStatus(500);
            }
            if (results && results.length > 0 && md5(req.body.p + results[0].salt) === results[0].password) {
                req.session.uid = results[0].id;
                req.session.name = results[0].name;
                req.session.pass = results[0].password;
                req.session.role = results[0].role;
                req.session.cid = results[0].cid;
                req.session.salt = results[0].salt;
                req.session.country = results[0].country;

                resolve(req.session.cid);
            } else {
                reject('[ERR] Wrong user name or password');
            }
        });
    });

    var authorition = (country) => {
        return new Promise((resolve, reject) => {
            var sql = "SELECT `id`, `name` FROM `site` WHERE country = ? ";

            DB.connection.query(sql, [country], (err, results, fields) => {
                if (err) {
                    reject(err);
                    res.sendStatus(500);
                }
                if (results && results.length > 0) {
                    req.session.sites = results

                    resolve();
                } else {
                    reject('[ERR] Authorition failed');
                }
            });
        });
    };

    authentication
        .then(authorition, console.error)
        .then(() => {
            res.redirect('/');
        }, err => {
            console.error(err);
            res.redirect('/login');
        })
});



/**
 * @returns: 302
 */
router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

/*********************************************************************************************************/
//                                          File
/*********************************************************************************************************/


/**
 * @returns: blob
 */
router.post('/xlsx', function (req, res) {

    var data = [
        ['Site ID', 'Domain', 'Applicant']
    ];

    for (let entry of req.body) {
        data.push([entry.site, entry.domain, entry.applicant]);
    }

    var buffer = xlsx.build([{
        data: data
    }]);

    res.send(buffer);
})



/*********************************************************************************************************/
//                                          Change Pass
/*********************************************************************************************************/

/**
 * @version: 2.0 
 * @param: op [string], np [string]
 * @returns: 200 / 404
 */

router.post('/password', function (req, res) {

    if (req.session.pass !== md5(req.body.op + req.session.salt)) {
        res.sendStatus(401);
    } else {
        var sql = 'UPDATE `user` SET `password` = ?, `salt` = ? WHERE `id` = ?';
        var salt = md5(new Date().getTime() + 'Riven');
        var pass = md5(req.body.np + salt);
        var params = [pass, salt, req.session.uid];
        DB.connection.query(sql, params, (err, results, fields) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                req.session.pass = pass;
                req.session.salt = salt;
                res.sendStatus(200);
            }
        });
    }
});


module.exports = router;