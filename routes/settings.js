var express = require('express');
var router = express.Router();
var userManager = require("../userManager");
var authorization = require("../authorization");

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
    res

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
    const id = authorization.getLoggedInUser(req);

    //get new username from req
    const newUsername = req.body["Name"];
    
    //get new password from req
    const newPassword = req.body["Password"];

    //get night mode setting from req
    const nightMode = req.body["Night_Mode"];

    try {
        //use id to update name

        if(newUsername !== ""){
            await userManager.updateUsername(id, newUsername);
        }

        //update password if not null or undefined
        if(newPassword !== ""){
            await userManager.updatePassword(id, newPassword);
        }

        //update nightmode if not null or undefined
        if(nightMode !== ""){
            await userManager.updateNight_Mode(id, nightMode);
         }
         
    } catch(err) {
        console.log(err);
        //ran into some error while updating
        return res.sendStatus(400);
    }
    
    //successfully updated user settings
    return res.sendStatus(200);
});


module.exports = router;
