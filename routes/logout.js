var express = require('express');
var router = express.Router();

/*
    Alex R
    GET /logout
    Clears the session cookie and then redirects to /login.
 */
router.get('/', async function(req, res, next) {
    //TODO
});

module.exports = router;
