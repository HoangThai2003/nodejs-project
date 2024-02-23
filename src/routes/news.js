const express = require("express");
const router = express.Router();

const newController = require("../app/controllers/NewController");

router.get("/create", newController.create);
router.post("/store", newController.store);
router.get("/:slug", newController.show);
router.get("/:id/edit", newController.edit);
router.get("/", newController.index);

module.exports = router;
