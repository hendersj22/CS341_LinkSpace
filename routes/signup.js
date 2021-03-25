var express = require('express');
var router = express.Router();

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

    Example request body:
    {
      "Name": "benl",
      "Password": "1234"
    }

    Response:
      - Success: Status code 200
      - Username taken: Status code 409
      - Server error: Status code 500
 */
router.post('/new-user', async function(req, res, next) {
    //TODO
});

module.exports = router;
