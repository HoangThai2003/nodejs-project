const sql = require("mysql");
const config = require("../../config/db/server");

class LoginController {
    login(req, res) {
        res.render("login");
    }

    authenticate(req, res, next) {
        sql.connect(config, (err) => {
            //Câu lệnh sql
            new sql.Request()
                .input("firstname", sql.NVarChar, firstname)
                .input("lastname", sql.NVarChar, lastname)
                .query(
                    "SELECT * FROM student WHERE firstname = @firstname AND lastname = @lastname",
                    (err, result) => {
                        if (err) {
                            console.error("Lỗi truy vấn:", err);
                            return res.send(
                                "Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.",
                            );
                        }
                    },
                );
            if (result.recordset.length > 0) {
                req.user = result.recordset[0]; // Lưu thông tin người dùng vào request
                next(); // Cho phép tiếp tục vào middleware tiếp theo
            } else {
                res.status(401).json({message: "Unauthorized"}); // Gửi mã lỗi 401 nếu đăng nhập không thành công
            }
        });
    }
}
module.exports = new LoginController();
