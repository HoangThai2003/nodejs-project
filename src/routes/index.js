const newRouter = require("./news");    
const siteRouter = require("./site");
const loginRouter = require("./login");

function route(app) {
    app.use("/news", newRouter);

    app.get("/login", loginRouter);

    app.use("/", siteRouter);
}
module.exports = route;
