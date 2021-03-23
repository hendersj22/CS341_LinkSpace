var express = require('express');
var router = express.Router();

/* GET following page. */
router.get('/', function(req, res, next) {
  res.render("followingPage");
});

module.exports = router;