const mysql = require("mysql");

// Kết nối tới MySQL
const connection = mysql.createConnection({
    host: "192.168.10.225",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_log",
});
module.exports = {connection};

const stream = require("stream");
const fs = require("fs-extra");

function createBackupJSON(callback) {
    // Khởi tạo câu lệnh
    const query =
        // "SELECT * FROM TicketSale WHERE SellTime >='2024-02-05 00:00:00' AND SellTime < '2024-02-06 00:00:00' LIMIT 10";
        "SELECT * FROM TicketSale WHERE SellTime >='2024-02-05 00:00:00' AND SellTime < '2024-02-06 00:00:00'";

    const transformStream = new stream.Transform({
        objectMode: true,
        transform(row, encoding, callback) {
            // Lấy dữ liệu từ database
            const uuid = row.UUID;
            const routeId = row.RouteId;
            // Biến đổi thời gian thanhd chuỗi(DD-MM-YYYY)
            const sellTime = row.SellTime.toISOString().slice(0, 10);
            // Tạo đường dẫn theo dữ liệu(UUID, RouteId, SellTime)
            const backupDirectory = `backup/${uuid}/${routeId}/${sellTime}`;
            // Khởi tạo file bằng npm fs
            fs.mkdirp(backupDirectory)
                .then(() => {
                    // Khởi tạo đường dẫn đến file
                    const backupFilePath = `${backupDirectory}/backup.json`;
                    // Dữ liệu truyền vào
                    return fs.appendFile(
                        backupFilePath,
                        JSON.stringify(row) + "\n",
                    );
                })
                // Hiển thị quá trình truyền dữ liệu
                .then(() => {
                    console.log(`Backup JSON created for UUID: ${uuid}`);
                    callback();
                })
                // Trường hợp khi lỗi
                .catch((err) => {
                    console.error("Error creating backup:", err);
                    callback(err);
                });
        },
    });
    // Quá trình thực hiện
    connection
        // Truyền sql
        .query(query)
        // Đọc và ghi giá trị từ một nguồn
        .stream()
        // Truyền dữ liệu từ đầu này sang đầu còn lại
        .pipe(transformStream)
        // Khởi tạo sự kiện on
        .on("finish", () => {
            console.log("Backup completed.");
            callback(null);
        })
        .on("error", (err) => {
            console.error("Error creating backup:", err);
            callback(err);
        });
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
