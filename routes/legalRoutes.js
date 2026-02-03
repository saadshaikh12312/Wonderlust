const express = require("express");
const router = express.Router();

router.get("/privacy", (req, res) => {
    res.render("others/privacy.ejs")
});

router.get("/terms", (req, res) => {
    res.render("others/terms.ejs")
});

module.exports = router;