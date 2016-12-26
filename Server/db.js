var mysql = require('mysql');

module.exports = class {

    constructor() {
        this.connection = mysql.createConnection(require('./config.js'));
        this.connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('New database connection established');
        });
    }
    close() {
        this.connection.end();
    }
}