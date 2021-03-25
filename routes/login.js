var express = require('express');
var router = express.Router();

/*
    Ryan, Alex M
    GET /login
    Render the login page
 */
router.get('/', async function(req, res, next) {
    res.render("logIn");
});

/*
    Ryan, Alex M
    POST /login/check
    Checks if the specified login credentials are valid
    On success, the client code will redirect to the index page: /

    Example request body:
    {
      "Name": "benl",
      "Password": "1234"
    }

    Response:
      - Success: Status code 200
      - Invalid username/password: Status code 403
      - Server error: Status code 500
 */
router.post('/check', async function(req, res, next) {
    //TODO
});

module.exports = router;
