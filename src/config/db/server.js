var mysql = require("mysql");

var con = mysql.createConnection({
    host: "192.168.10.225",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_log",
});

con.connect(function (err) {
    if (err) throw err;
    con.query(
        "SELECT * FROM TicketSale WHERE SellTime >='2024-02-05 00:00:00' AND SellTime < '2024-02-06 00:00:00';",
        function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        },
    );
});
