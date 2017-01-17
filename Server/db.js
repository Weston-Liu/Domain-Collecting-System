const mysql = require('mysql');
const colors = require('colors');

module.exports = class {

    constructor() {
        this.connection = mysql.createConnection(require('./config.js'));
        this.connection.connect((err) => {
            if (err) 
                console.log(colors.red.bold('error connecting: ' + err.message));
        });
    }
    close() {
        this.connection.end();
    }
}