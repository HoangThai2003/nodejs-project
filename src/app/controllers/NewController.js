const sql = require("mssql");
const config = require("../../config/db/server");

class NewController {
    // Phương thức GET /news
    index(req, res, next) {
        sql.connect(config, (err) => {
            //Câu lệnh sql
            new sql.Request().query("SELECT * FROM student", (err, result) => {
                if (err) {
                    console.error("Lỗi truy vấn:", err);
                    return us(500).send(
                        "Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.",
                    );
                }
                // Lấy data
                let data = result.recordset;
                // Đẩy dữ liệu data ra ngoài
                res.render("news", { data });
            });
        });
    }

    // Phương thức GET /news/:slug
    show(req, res) {
        res.send("NEW DETAIL");
    }
    // Phương thức GET /news/create
    create(req, res) {
        res.render("users/create");
    }
    // Phương thức POST /news/store
    store(req, res) {
        sql.connect(config, (err) => {
            //Câu lệnh sql
            new sql.Request()
                .input("firstname", sql.NVarChar, req.body.firstname)
                .input("lastname", sql.NVarChar, req.body.lastname)
                .query(
                    "INSERT student VALUES(@firstname, @lastname) ",
                    (err, result) => {
                        if (err) {
                            console.error("Lỗi truy vấn:", err);
                            return res.send(
                                "Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.",
                            );
                        }
                        res.redirect("/news");
                    },
                );
        });
    }
    edit(req, res) {
        res.render("users/edit");
    }
}

module.exports = new NewController();
