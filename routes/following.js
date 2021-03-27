var express = require('express');
var router = express.Router();

/*
    GET /following
    Renders the following page, which includes users followed and suggested catalogs and users.
 */
router.get('/', async function(req, res, next) {
    res.render("followingPage");
});

/*
    Gabby
    POST /following/users
    Gets a list of users that the logged in user is following in JSON format sorted by Name or Date in
    "ascending" or "descending" order.
    The SortBy and Order arguments are optional and default to Name and ascending respectively.

    Example request body:
    {
      “SortBy”: “Date_Followed”,
      "Order": "ascending"
    }

    Example response:
    [
      {
        "User_ID": 1,
        "Name": "andrewn",
        "Date_Followed": 1616541032321	// Unix time in milliseconds
      },
      {
        "User_ID": 0,
        "Name": "benl",
        "Date_Followed": 1616847422345	// Unix time in milliseconds
      }
    ]
 */
router.post('/users', async function(req, res, next) {
    //TODO
});

module.exports = router;
