var express = require('express');
var router = express.Router();
var userManager = require('../userManager');

/*
    GET /signup
    Render the signup page
 */
router.get('/', async function(req, res, next) {
    res.render("signUp");
});


/*
    POST /signup/new-user
    Creates a new account with the specified credentials
    On success, the client code will redirect to the index page: /

    Example request body:
    {
      "Name": "benl",
      "Password": "1234"
    }

    Response:
      - Success: Status code 200
      - Username taken: Status code 409
 */
router.post('/new-user', async function(req, res, next) {
    const username = req.body["Name"];
    const password = req.body["Password"];

    try {
        const id = await userManager.createAccount(username, password);
        req.session["User_ID"] = id;
        res.sendStatus(200);
    } catch {
        res.sendStatus(409);
    }

});

module.exports = router;
