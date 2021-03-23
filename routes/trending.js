var express = require('express');
var router = express.Router();

/* GET trending page. */
router.get('/', function(req, res, next) {
  res.render("TrendingPage");
});

module.exports = router;
