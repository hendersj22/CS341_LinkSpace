var express = require('express');
var router = express.Router();
var authorization = require('../authorization');
var userManager = require('../userManager');

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
    //get user id
    const id = authorization.getLoggedInUser(req);

    //get sortby
    const sortBy = req.body["SortBy"];

    //get order
    const order = req.body["Order"];

    //get followers
    const followers = await userManager.getFollowers(id, order, sortBy);

    res.json(followers);

});


/*
    POST /following/new
    The logged in user uses this to follow the specified account.

    Example request body:
    {
      “Follower_ID”: 3  // Follow account with User_ID 3
    }
*/
router.post('/new', async function(req, res, next) {
    //get user id
    const id = authorization.getLoggedInUser(req);

    const followerID = req.body["Follower_ID"];

    try {
        await userManager.followUser(id, followerID);
        res.sendStatus(200);
    } catch {
        // Bad request, perhaps follower not found
        res.sendStatus(400);
    }
});

/*
    POST /following/remove
    The logged in user uses this to unfollow the specified account.

    Example request body:
    {
      “Follower_ID”: 3    // Unfollow account with User_ID 3
    }

 */
router.post('/remove', async function(req, res, next) {
    //get user id
    const id = authorization.getLoggedInUser(req);

    const followerID = req.body["Follower_ID"];

    try {
        await userManager.unfollowUser(id, followerID);
        res.sendStatus(200);
    } catch {
        // Bad request, perhaps follower not found
        res.sendStatus(400);
    }
});


module.exports = router;
