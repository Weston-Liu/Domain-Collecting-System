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
        err && console.log(err);
        res.json(results);
    });
});


/*********************************************************************************************************/
//                                          Category ADD
/*********************************************************************************************************/

/**
 * @param: country <string>
 * @returns: {success: <boolean>, (id: <int>)}
 */
router.put('/country', function (req, res) {

    console.log(`Adding site [${req.query.country}]...`);
    var sql = "INSERT INTO `country` (`name`) VALUES (?)";
    var params = [req.query.country];

    DB.connection.query(sql, params, (err, results, fields) => {
        var ret = {
            success: !err
        };
        if (err) {
            console.log(err);
        } else {
            ret['id'] = results.insertId;
        }
        res.json(ret);
    });
});
/**
 * @param: country <int>, site <string>
 * @returns: {success: <boolean>}
 */
router.put('/site', function (req, res) {

    insertSite(req.query)
        .then(insertCategory, console.error)
        .then(console.log, console.error);

    function insertSite(query) {
        return new Promise((resolve, reject) => {

            console.log(`Adding site [${query.site}]...`);
            var sql = "INSERT INTO `site` (`name`) VALUES (?)";
            var params = [query.site];
            DB.connection.query(sql, params, (err, results, fields) => {
                console.log(err);
                err && reject(err);
                resolve([query, results.insertId]);
                console.log(`Done! Site ID: ${results.insertId}`);
            });
        });
    }

    function insertCategory(p) {
        return new Promise((resolve, reject) => {

            console.log(`Building relationship between country[${p[0].country}] and site[${p[1]}]...`);
            var sql = "INSERT INTO `category` (`country`, `site`) VALUES (?, ?)";
            var params = [p[0].country, p[1]];
            DB.connection.query(sql, params, (err, results, fields) => {
                var ret = {
                    success: !err
                };
                if (err) {
                    reject(err);
                } else {
                    ret['sid'] = p[1];
                    ret['cid'] = results.insertId;
                    resolve(`Done! Relationship ID: ${results.insertId}`);
                }
                res.json(ret);
            });
        });
    }



});

/*********************************************************************************************************/
//                                          Category DELETE
/*********************************************************************************************************/

/**
 * @param: country <int>
 * @returns: {success: <boolean>}
 */
router.delete('/country', function (req, res) {
    var sql = "DELETE FROM `country` WHERE `id` = ?";
    var params = [req.query.country];

    DB.connection.query(sql, params, (err, results, fields) => {
        err && console.log(err);
        res.json({
            success: !err
        });
    });
});

/**
 * @param: site <int>
 * @returns: {success: <boolean>}
 */
router.delete('/country', function (req, res) {
    var sql = "DELETE FROM `site` WHERE `id` = ?";
    var params = [req.query.site];

    DB.connection.query(sql, params, (err, results, fields) => {
        err && console.log(err);
        res.json({
            success: !err
        });
    });
});

/*********************************************************************************************************/
//                                          Category UPDATE
/*********************************************************************************************************/


/**
 * @param: id <int>, name <string>
 * @returns: {success: <boolean>}
 */
router.post('/country', function (req, res) {
    var sql = "UPDATE `country` SET `name` = ? WHERE `id` = ?";
    var params = [req.query.name, req.query.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        err && console.log(err);
        res.json({
            success: !err
        });
    });
});

/**
 * @param: id <int>, name <string>
 * @returns: {success: <boolean>}
 */
router.post('/site', function (req, res) {
    var sql = "UPDATE `site` SET `name` = ? WHERE `id` = ?";
    var params = [req.query.name, req.query.id];

    DB.connection.query(sql, params, (err, results, fields) => {
        err && console.log(err);
        res.json({
            success: !err
        });
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
        INNER JOIN `country` ON site.country = country.id \
        ORDER BY `cid`";

    DB.connection.query(sql, (err, results, fields) => {
        err && console.log(err);

        var ret = [];
        var countryMap = new Map();

        for (let entry of results) {
            if (countryMap.has(entry.cid)) {
                ret[countryMap.get(entry.cid)].sites.push({
                    id: entry.sid,
                    name: entry.site
                });
            } else {
                countryMap.set(entry.cid, ret.length);
                ret.push({
                    id: entry.cid,
                    name: entry.country,
                    sites: [{
                        id: entry.sid,
                        name: entry.site
                    }]
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