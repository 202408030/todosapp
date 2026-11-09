const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "todosid",
    password: "todosid",
    database: "todosdb",
    waitForConnections: true,
    connectionLimit: 5
});

module.exports = pool;
