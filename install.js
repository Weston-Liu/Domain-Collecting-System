const readline = require('readline');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var conf = {
    host: '',
    port:'',
    user: '',
    password: '',
    database: ''
};

console.log(colors.yellow.bold('****** Welcome to Domain Collecting System! ******\n'));
 
console.log(colors.cyan.bold("To begin the installation process, we just need some info about your database...\n"));

rl.question(colors.magenta.bold("Please input your database host, press enter to use `localhost`...\n"), (answer) => {
    conf.host = answer === '' ? 'localhost' : answer;
    rl.question(colors.magenta.bold("Please input the database port, press enter to use `3306`...\n"), (answer) => {
        conf.port = answer === '' ? '3306' : answer;
            rl.question(colors.magenta.bold('Please input the database user, press enter to use `root`...\n'), (answer) => {
                conf.user = answer === '' ? 'root' : answer;
                rl.question(colors.magenta.bold('Please input the user password...\n'), (answer) => {
                    conf.password = answer;
                    rl.question(colors.magenta.bold('Please input the database name, press enter to use `dcs`...\n'), (answer) => {
                        conf.database = answer === '' ? 'dcs' : answer;

                        var c = `\n`+
                        `Host: ${conf.host}:${conf.port}\n`+
                        `User: ${conf.user}\n`+
                        `Password: ${conf.password}\n`+
                        `Database: ${conf.database}\n`;
                    
                        console.log(colors.green.bold(c));

                        rl.question(colors.cyan.bold("Your database config is as above, continue? (y/n)\n"), (answer) => {
                            if(answer === 'y' || answer === 'Y')
                                install();
                            else
                                console.log(colors.red.bold("Configuration terminated, please run `npm run install` again."));
                            rl.close();
                     })
                });
            });
        });
    });
});


function install(){
    console.log(colors.cyan.bold('Installing...'));

    writeConfig()
    .then(createDatabase, err => {console.error(colors.red.bold(err)); return Promise.reject()})
    .then(writeData,  err => {console.error(colors.red.bold(err)); return Promise.reject()})
    .then(() => {
        console.log(colors.cyan.bold('\nInstallation finished successfully!\n'));
        console.log(colors.yellow.bold('You can use `npm start` to launch the app.'));
        console.log(colors.yellow.bold('Now I will just do this for you.'));
        process.exit();
    }, () => {
        console.log(colors.red.bold('Installation failed, please retry or instal manually.'));
        process.exit();
    })
}

function writeConfig(){
    return new Promise((resolve, reject) => {
        console.log(colors.cyan.bold('Writing Configuration File...'));
        fs.writeFile(path.join(__dirname, 'server', 'config.js'), 'module.exports = ' + JSON.stringify(conf), function (err) {
            if (err) reject(err)
            resolve();
        });
    })
}

function createDatabase(){
    return new Promise((resolve, reject) => {
        console.log(colors.cyan.bold('Done'));
        console.log(colors.cyan.bold('Creating Database...'));

        var connection = mysql.createConnection({
            host     : conf.host,
            user     : conf.user,
            password : conf.password
        });

        connection.connect(function(err) {
            if (err) reject(err);
        });

        connection.query(`CREATE DATABASE IF NOT EXISTS ${conf.database}`, function (err, results, fields) {
            if (err) reject(err);
            resolve();
            connection.end();
        });
        
    })
}

function writeData(){
    return new Promise((resolve, reject) => {
        console.log(colors.cyan.bold('Done'));
        console.log(colors.cyan.bold('Writing Data...'));

        var connection = mysql.createConnection({
            host     : conf.host,
            user     : conf.user,
            password : conf.password,
            database : conf.database,
            multipleStatements: true
        });

        connection.connect(function(err) {
            if (err) reject(err);
        });

        var sql = fs.readFileSync(path.join(__dirname, 'server', 'database.sql'), "utf-8"); 

        connection.query(sql, function (err, results, fields) {
            if (err) reject(err);
            resolve();
        });
        
    })
}