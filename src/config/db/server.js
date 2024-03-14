const mysql = require("mysql");

// Kết nối tới MySQL
const connection = mysql.createConnection({
    host: "192.168.10.225",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_log",
});

const localconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vebus_log",
});

module.exports = {connection};
