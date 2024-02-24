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
                    return res.send("Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.");
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
        sql.connect(config, (err) => {
            // Câu lệnh sql
            new sql.Request()
                .input("firstname", sql.NVarChar, req.body.firstname)
                .input("lastname", sql.NVarChar, req.body.lastname)
                .input("id", sql.Int, req.params.id)
                .query(
                    "SELECT * FROM student WHERE id = @id",
                    // UPDATE student SET firstname = @firstname, lastname = @lastname WHERE id = @id
                    (err, result) => {
                        if (err) {
                            console.error("Lỗi truy vấn:", err);
                            return res.send(
                                "Lỗi truy vấn dữ liệu từ cơ sở dữ liệu.",
                            );
                        }
                        // Lấy data
                        let data = result.recordset[0];
                        res.render("users/edit", data);
                    },
                );
        });
    }
    update(req, res) {
        sql.connect(config, (err) => {
            // Câu lệnh sql
            new sql.Request()
                .input("firstname", sql.NVarChar, req.body.firstname)
                .input("lastname", sql.NVarChar, req.body.lastname)
                .input("id", sql.Int, req.params.id)
                .query(
                    "UPDATE student SET firstname = @firstname, lastname = @lastname WHERE id = @id",
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

    destroy(req, res) {
        sql.connect(config, (err) => {
            // Câu lệnh sql
            new sql.Request()
                .input("id", sql.Int, req.params.id)
                .query(
                    "DELETE * FROM student WHERE id = @id",
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
}

module.exports = new NewController();
