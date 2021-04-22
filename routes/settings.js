var express = require('express');
var router = express.Router();
var userManager = require("../userManager");
var authorization = require("../authorization");

/*
    GET /settings
    Renders the settings page
 */
router.get('/', async function(req, res, next) {
    res.render("settingsPage"); //TODO view doesnt exist yet
});

/*
    Nathan
    GET /settings/list
    List the current settings in JSON format.

    Example response body:
    {
      "User_ID": 0,
      “Name”: “benl”,
      “Night_Mode”: false
    }
 */
router.get('/list', async function(req, res, next) {
    const id = authorization.getLoggedInUser(req);

    const username = await userManager.getUsername(id);
    const nightMode = await userManager.getNight_Mode(id);
    res.json({
        "User_ID": id,
        "Name": username,
        "Night_Mode": nightMode
    })



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

    //get display size setting from request
    const displaySize = req.body["Display_Size"];

    // get status setting from req
    const status = req.body["Status"];

    //checking new data
    console.log("id: " + id);
    console.log("new username: " + newUsername);
    console.log("new password: " + newPassword);
    console.log("night mode: " + nightMode);
    console.log("display size: " + displaySize);
    console.log("status: " + status);

    try {
        //use id to update name
        if(newUsername !== "" && newUsername !== null && newUsername !== undefined){
            await userManager.updateUsername(id, newUsername);
        }

        //update password if not null or undefined
        if(newPassword !== "" && newPassword !== null && newPassword !== undefined){
            await userManager.updatePassword(id, newPassword);
        }

        //update nightmode if not null or undefined
        if(nightMode !== "" && nightMode !== null && nightMode !== undefined){
            await userManager.updateNight_Mode(id, nightMode);
        }

        //update display_size if not null or undefined
        if(displaySize !== "" && displaySize !== null && displaySize !== undefined){
            await userManager.updateDisplaySize(id, displaySize);
        }

        //update status if not null or undefined
        if(status !== "" && status !== null && status !== undefined){
            await userManager.updateStatus(id, status);
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
