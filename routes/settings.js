var express = require('express');
var router = express.Router();

/*
    GET /settings
    Renders the settings page
 */
router.get('/', async function(req, res, next) {
    res.render("settings"); //TODO view doesnt exist yet
});

/*
    Nathan
    GET /settings/list
    List the current settings in JSON format.

    Example response body:
    {
      "User_ID": 0,
      “Name”: “benl”,
      “Password”: null,   // Password is not sent for security
      “Night_Mode”: false
    }
 */
router.get('/list', async function(req, res, next) {
    //TODO
});

/*
    Phuocan, Gabby
    POST /settings/edit
    Replaces the settings of the specified user with the specified settings.

    Example request body:
    {
      “Name”: “ben”,      // update username
      “Password”: null,   // don’t update password if null or undefined
      “Night_Mode”: null    // don’t update dark mode if null or undefined
    }
 */
router.post('/edit', async function(req, res, next) {
    //TODO
});


module.exports = router;
