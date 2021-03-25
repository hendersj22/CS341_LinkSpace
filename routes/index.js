var express = require('express');
var router = express.Router();

/*
    GET /
    Renders the homepage
 */
router.get('/', async function(req, res, next) {
    res.render("homepage");
});

module.exports = router;
