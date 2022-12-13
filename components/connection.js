var mysql = require('mysql')
require('dotenv').config();



module.exports = () => {
    var connection = mysql.createConnection({
        host: process.env.host || 'localhost',
        database: process.env.database,
        user: process.env.user,
        password: process.env.password
    });

    connection.connect(function (error) {
        if (error) {
            throw error;
        } else {
            console.log('CONEXIÓN EXITOSA');
        }
    });

    return connection;
}