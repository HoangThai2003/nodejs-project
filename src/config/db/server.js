const fs = require("fs");
const path = require("path"); // Thêm module path để làm việc với đường dẫn
const mysql = require("mysql");

// Tạo kết nối tới MySQL
const connection = mysql.createConnection({
    host: "192.168.10.225",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_log",
});
const backupDirectory = "backup";
// Kết nối tới cơ sở dữ liệu
connection.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối:", err);
        return;
    }
    console.log("Kết nối thành công!");

    const query =
        "Select * from TicketSale where SellTime >='2024-02-05 00:00:00' AND SellTime < '2024-02-06 00:00:00'";

    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return;
        }

        results.forEach((row) => {
            // Tạo UUID cho thư mục backup
            const backupUUID = row.UUID;
            const backupDirectoryPath = `${backupDirectory}/${backupUUID}`;

            const sellTimeStr = row.SellTime.toISOString().slice(0, 10); // Lấy phần ngày từ giá trị Date

            if (!fs.existsSync(backupDirectoryPath)) {
                fs.mkdirSync(backupDirectoryPath, {recursive: true});
            }

            const routeDirectoryPath = `${backupDirectoryPath}/${row.RouteId}`;
            if (!fs.existsSync(routeDirectoryPath)) {
                fs.mkdirSync(routeDirectoryPath, {recursive: true});
            }

            const sellTimeDirectoryPath = `${routeDirectoryPath}/${sellTimeStr}`;
            if (!fs.existsSync(sellTimeDirectoryPath)) {
                fs.mkdirSync(sellTimeDirectoryPath, {recursive: true});
            }

            const filePath = `${sellTimeDirectoryPath}/data.json`;

            const dataToBackup = JSON.stringify(row, null, 2);
            fs.writeFile(filePath, dataToBackup, (err) => {
                if (err) {
                    console.error("Lỗi khi ghi vào tệp tin:", err);
                    return;
                }
                console.log("Sao lưu dữ liệu thành công vào", filePath);
            });
        });
    });
});
