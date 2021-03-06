var express = require('express');
var router = express.Router();
var catalogManager = require("../catalogManager");
/*
    GET /trending
    Renders the trending page
 */
router.get('/', async function(req, res, next) {
    res.render("TrendingPage");
});

/*
    POST /trending/list
    Gets a list of information of all trending catalogs in JSON format ordered in “ascending” or “descending” by Name.
    The order argument is optional and defaults to ascending.

    Example request body:
    {
      "Order": “ascending"
    }

    Example response body:
    [
      {
        “Catalog_ID”: 1,
        “Name”: “My Catalog 1”,
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
      },
      {
        “Catalog_ID”: 5,
        “Name”: “My flashcards”,
        “Links”:
          [
            {
              “Entry_ID”: 7,
              “URL”: “www.quizlet.com”,
              “Description”: “Quizlet”,
              “Date_Added”: 1616571462541	// Unix time in milliseconds
            },
            {
              “Entry_ID”: 10,
              “URL”: “https://apps.ankiweb.net”,
              “Description”: “Anki”,
              “Date_Added”: 1617551096347	// Unix time in milliseconds
            }
          ],
         “User_ID”: 1
      }
    ]
 */
router.post('/list', async function(req, res, next) {
    let order = req.body["order"];
    if (!order) order = "descending";

    try {
        const catalogs = await catalogManager.getTrendingCatalogs(order);
        res.json(catalogs);
    } catch {
        res.sendStatus(500);
    }

});

module.exports = router;
