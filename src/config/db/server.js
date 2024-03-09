const mysql = require("mysql");
const stream = require("stream");
const fs = require("fs-extra");
var cron = require("node-cron");

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

function createBackupJSON(callback) {
    const query =
        "SELECT * FROM TicketSale WHERE SellTime >= ? AND SellTime < ? LIMIT 50";
    const startTime = new Date("2024-02-05 00:00:00");
    const endTime = new Date("2024-02-06 00:00:00");

    // Tạo công việc sao lưu hàng ngày vào lúc 12:00
    cron.schedule(
        "0 0 0 * * *",
        () => {
            const transformStream = new stream.Transform({
                objectMode: true,
                transform(row, encoding, callback) {
                    const uuid = row.UUID;
                    const routeId = row.RouteId;
                    const sellTime = row.SellTime.toISOString().slice(0, 10);
                    const backupDirectory = `backup/${uuid}/${routeId}/${sellTime}`;
                    fs.mkdirp(backupDirectory)
                        .then(() => {
                            const backupFilePath = `${backupDirectory}/data.json`;
                            return fs.appendFile(
                                backupFilePath,
                                JSON.stringify(row) + "\n",
                            );
                        })
                        .then(() => {
                            console.log(
                                `Backup JSON created for UUID: ${uuid}`,
                            );
                            callback();
                        })
                        .catch((err) => {
                            console.error("Error creating backup:", err);
                            callback(err);
                        });
                },
            });

            connection
                .query(query, [startTime, endTime])
                .stream()
                .pipe(transformStream)
                .on("finish", () => {
                    console.log("Backup completed.");
                    callback(null);
                })
                .on("error", (err) => {
                    console.error("Error creating backup:", err);
                    callback(err);
                });
        },
        {
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

// Check lỗi và thông báo thành công
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    createBackupJSON((err) => {
        connection.end();
        if (err) {
            console.error("Error creating backup:", err);
            return;
        }
        console.log("Backup created successfully.");
    });
});

// Câu lệnh node src/index.js
