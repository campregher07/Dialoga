// db/mysql.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // password: 'Dani090707*',
    database: 'DialogaDatabase',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error("Erro na conexão com MySQL:", err);
    } else {
        console.log("Conexão com MySQL estabelecida.");
    }
});

module.exports = connection;
