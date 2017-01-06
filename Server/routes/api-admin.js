var database = require('../db.js');
var express = require('express');
var router = express.Router();
var DB = new database();


/*********************************************************************************************************/
//                                          Domain QUERY
/*********************************************************************************************************/

/**
 * @returns: [{}.. [object]]
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
        ORDER BY cTime";

    DB.connection.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.json(results);
    });
});


/*********************************************************************************************************/
//                                          Category ADD
/*********************************************************************************************************/

/**
 * @param: name <string>
 * @returns: 200 / 500
 */
router.put('/country', function (req, res) {
    var sql = "INSERT INTO `country` (`name`) VALUES (?)";
    var params = [req.body.name];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});
/**
 * @param: country <int>, name <string>
 * @returns: 200 / 500
 */
router.put('/site', function (req, res) {
    var sql = "INSERT INTO `site` (`name`, `country`) VALUES (?,?)";
    var params = [req.body.name, req.body.country];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/*********************************************************************************************************/
//                                          Category DELETE
/*********************************************************************************************************/

/**
 * @param: id <int>
 * @returns: 200 / 500
 */
router.delete('/country', function (req, res) {
    var sql = "DELETE FROM `country` WHERE `id` = ?";
    var params = [req.body.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/**
 * @param: id <int>
 * @returns: 200 / 500
 */
router.delete('/site', function (req, res) {
    var sql = "DELETE FROM `site` WHERE `id` = ?";
    var params = [req.body.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/*********************************************************************************************************/
//                                          Category UPDATE
/*********************************************************************************************************/


/**
 * @param: id <int>, name <string>
 * @returns: 200 / 500
 */
router.post('/country', function (req, res) {
    var sql = "UPDATE `country` SET `name` = ? WHERE `id` = ?";
    var params = [req.body.name, req.body.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/**
 * @param: id <int>, name <string>
 * @returns: 200 / 500
 */
router.post('/site', function (req, res) {
    var sql = "UPDATE `site` SET `name` = ? WHERE `id` = ?";
    var params = [req.body.name, req.body.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

/*********************************************************************************************************/
//                                          Site QUERY
/*********************************************************************************************************/

/**
 * @version: 2.0.0
 * @param: country: <int> 
 * @returns: [{id: <int>, cid: <int>, country: <string>, sid: <int>, site: <string>} <object>] <array>
 */
router.get('/site', function (req, res) {

    var sql = "SELECT \
        country.id AS `cid`, \
        country.name AS `country`, \
        site.id AS `sid`, \
        site.name AS `site` \
        FROM `site` \
        RIGHT JOIN `country` ON site.country = country.id \
        ORDER BY `cid`";

    DB.connection.query(sql, (err, results, fields) => {
        err && console.log(err);

        var ret = [];
        var countryMap = new Map();

        for (let entry of results) {
            // if has country
            if (countryMap.has(entry.cid)) {
                ret[countryMap.get(entry.cid)].sites.push({
                    id: entry.sid,
                    name: entry.site
                });
            } else {
                // create a new country
                countryMap.set(entry.cid, ret.length);
                ret.push({
                    id: entry.cid,
                    name: entry.country,
                    sites: entry.sid ? [{
                        id: entry.sid,
                        name: entry.site
                    }] : []
                });
            }
        };

        res.json(ret);
    });
});

/*********************************************************************************************************/
//                                          User ADD
/*********************************************************************************************************/

/**
 * @param: name <string>, password <string>, role <int>, country <int>
 * @returns: 200 / 304
 */
router.put('/user', function (req, res) {
    var sql = "INSERT INTO `user` (`name`, `password`, `role`, `country`) VALUES (?, ?, ?, ?)";
    var params = [req.query.name, req.query.password, req.query.role, req.query.country];

    DB.connection.query(sql, params, (err, results, fields) => {
        err && console.log(err);
        res.send(err ? 304 : 200);
    });
});


module.exports = router;