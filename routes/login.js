var express = require('express');
var router = express.Router();
var authorization = require('../authorization');
var userManager = require('../userManager');

/*
    Ryan, Alex M
    GET /login
    Render the login page
 */
router.get('/', async function(req, res, next) {
    const id = authorization.getLoggedInUser(req);
    if (id === undefined) {
        res.render("logIn");
    } else {
        res.redirect("/");
    }

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
    var username = req.body["Name"];
    var password = req.body["Password"];

    if (await authorization.areValidCredentials(username, password)) {
        const id = await userManager.getID(username);
        req.session["User_ID"] = id;
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
});

module.exports = router;
