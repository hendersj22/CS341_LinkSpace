var express = require('express');
var router = express.Router();
var userManager = require("../userManager");
const catalogManager = require("../catalogManager");

/*
    Gabby
    POST /user/{id}/list
    List the username, catalogs created in JSON format ordered in “ascending” or “descending” by Name. The order argument is optional and defaults to ascending.

    Example request body:
    {
      "Order": "ascending"
    }

    Example Response Body: //NOTE: user 0 only has 1 catalog in this case
    {
      "Name": "benl",
      "Catalogs":
        [
          {
            “Catalog_ID”: 1,
            “Name”: “My Catalog 1”,
            "Author": "benl",
            “Links”:
              [
                {
                  “Entry_ID”: 1,
                  “URL”: “www.google.com”,
                  “Description”: “Favorite search engine”,
                  “Date_Added”: 1616541032321	// Unix time in milliseconds
                },
                {
                  “Entry_ID”: 2,
                  “URL”: “learning.up.edu”,
                  “Description”: “School Work”,
                  “Date_Added”: 1616541092945	// Unix time in milliseconds
                }
              ],
            “User_ID”: 0
          }
        ]
    }
 */
router.post('/*/list', async function(req, res, next) {
    //req.path = /{id}/list
    const id = req.path.split("/")[1];
    //Check that id is valid
    const validID = await userManager.idExists(id);
    if (!validID) return next();

    //get username
    const username = await userManager.getUsername(id);

    //get order
    const order = req.body["Order"];

    //get catalogs by user
    const catalogs = await catalogManager.getCatalogsByUser(id, order);

    //build return json
    const results = {
        "Name": username,
        "Catalogs": catalogs,
    };

    //return order
    res.json(results);
});

router.get("/*/username", async function(req, res, next) {
    //req.path = /{id}/list
    const id = req.path.split("/")[1];
    //Check that id is valid
    const validID = await userManager.idExists(id);
    if (!validID) return res.sendStatus(404);

    const username = await userManager.getUsername(id);

    res.send(username.toString());
})
/*
    GET /user/{id}
    Renders the profile page, including their created catalogs, of the specified user
 */
router.get('/*', async function(req, res, next) {
    //req.path = /{id}
    const id = req.path.split("/")[1];
    //Check that id is valid
    const validID = await userManager.idExists(id);
    if (!validID) return next();

    res.render("user"); //TODO view doesn't exist
});

module.exports = router;