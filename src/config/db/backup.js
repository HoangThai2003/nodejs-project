const stream = require("stream");
const fs = require("fs-extra");
var cron = require("node-cron");
const connection = require("./server");

function createBackupJSON(callback) {
    const query =
        "SELECT * FROM TicketSale WHERE SellTime >= ? AND SellTime < ? LIMIT 50";
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const startTime = new Date("2024-02-05 00:00:00"); //yesterday;
    const endTime = new Date("2024-02-06 00:00:00"); //today;

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
createBackupJSON((err) => {
    if (err) {
        console.error("Error creating backup:", err);
        return;
    }
    console.log("Backup created successfully.");
});
