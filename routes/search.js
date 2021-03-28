var express = require('express');
var router = express.Router();
var catalogManager = require("../catalogManager");

/*
    GET /search?query={search query}
    Renders the search results page
    The query will be URI encoded.
    Use encodeURIComponent(query) or decodeURIComponent(query).
 */
router.get('/', async function(req, res, next) {
    res.render("searchPage");
});

/*
    Phuocan, Alex M
    POST /search/list
    Gets the search results of the specified query  in JSON format ordered in “ascending” or “descending” by Name.
    The order argument is optional and defaults to ascending.

    Example request body:
    {
      “Query”: “My ”,
      "Order": "ascending"
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
    //TODO

    const results = await catalogManager.search(req.body["Query"], req.body["Order"]);
    return res.json(results);
    
});

module.exports = router;
