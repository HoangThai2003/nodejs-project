class SiteController {
    // Phương thức GET /news
    index(req, res) {
        res.render("home");
    }

    // Phương thức GET /news/:slug
    search(req, res) {
        res.render("search");
    }
}
module.exports = new SiteController();
