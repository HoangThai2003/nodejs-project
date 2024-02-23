const sql = require("mssql");

// Cấu hình kết nối tới SQL Server
const config = {
    user: "sa",
    password: "123",
    server: "DESKTOP-KBM166O\\SQL2022",
    database: "NodejsExamDatabase",
    options: {
        encrypt: false, // Nếu bạn sử dụng kết nối được mã hóa
    },
};

sql.connect(config, (err) => {
    if (err) {
        console.error("Lỗi kết nối:", err);
        return;
    }
    console.log("Kết nối thành công tới SQL Server.");
});

module.exports = { config };
