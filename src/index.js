const express = require("express");
// Framework tạo header footer mặc định
const {engine} = require("express-handlebars");
// Hiển thị thêm dòng thông tin lịch sử ở terminal
const path = require("path");
const methodOverride = require("method-override");
const routes = require("./routes");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride("_method"));
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
    }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Khỏi tạo tuyến đường sang routes/index.js
routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
