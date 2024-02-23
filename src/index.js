const express = require("express");
// Framework tạo header footer mặc định
const { engine } = require("express-handlebars");
// Hiển thị thêm dòng thông tin lịch sử ở terminal
const morgan = require("morgan");
const path = require("path");

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

// Dòng cài đặt hiển thị morgan
// app.use(morgan('combined'))

// Tạo file mặc định của file handlebars
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
