const express = require("express");
const dbms = require("../dbms_promise");
const router = express.Router();
const userManager = require("../userManager");
const authorization = require("../authorization");
const catalogManager = require("../catalogManager");



/*
    GET /catalog
    Renders the my catalogs page.
 */
router.get("/", async function(req, res, next) {
    res.render("MyCatalogs");
});

/*
    Alex R
    POST /catalog/list
    List the my catalogs of the logged in user in JSON format ordered in “ascending” or “descending” by name. The order argument is optional and defaults to ascending.

    Example request body:
    {
      "Order": "descending"
    }

    Example Response Body:
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
    ]
 */
router.post("/list", async function(req, res, next) {
    //TODO
});

/*
    GET /catalog/create
    Renders the create catalog page
 */
router.get("/create", async function(req, res, next) {
    res.render("catalogCreation");
});

/*
    Alex Mak
    POST /catalog/create
    Creates a new catalog with the specified info.
    Returns the new catalog ID.

    Example request body:
    {
        “Name”: “My Catalog 1”,
        “Links”: {
            “Favorite search engine”: “www.google.com”,
            “School Work”: “learning.up.edu”
        }
    }

    Example response body:
    1	// ID of the new catalog
 */
router.post("/create", async function(req, res, next) {
    // Get the catalog name
    const name = req.body["Name"];
    // Get the links
    const links = req.body["Links"];

    // Arguments not supplied: bad request
    if (!name || !links) return res.sendStatus(400);

    const id = await catalogManager.createCatalog(name, links);

    //Send the new catalog id back to the client code.
    res.send(id.toString());
});

/*
    GET /catalog/{id}/edit
    Renders the catalog edit page
 */
router.get("/*/edit", async function(req, res, next) {
    //req.path = /{id}/edit
    const catalogID = req.path.split("/")[1];
    //Check that catalog is valid
    const validCatalogID = await catalogManager.catalogIDExists(catalogID);
    if (!validCatalogID) return next();

    res.render("EditingCatalog");
})

/*
    Gianni, Kyle
    POST /catalog/{id}/edit
    Replaces the content of a catalog with the specified content.

    Example request body:
    {
      “Name”: “My Catalog 1”,
      “Links”:
        {
          “Favorite search engine”: “www.google.com”,
          “School Work”: “learning.up.edu”
        }
    }
 */
router.post("/*/edit", async function(req, res, next) {
    //req.path = /{id}/edit
    const catalogID = req.path.split("/")[1];
    //Check that catalog is valid
    const validCatalogID = await catalogManager.catalogIDExists(catalogID);
    if (!validCatalogID) return next();

    //TODO
});

/*
    Alex M
    POST /catalog/{id}/copy
    Clones a catalog with the specified id
    Gets the id of the new catalog

    No request body needed

    Example response body:
    2	// ID of the new catalog
 */
router.post("/*/copy", async function(req, res, next) {
    //req.path = /{id}/copy
    const catalogID = req.path.split("/")[1];
    //Check that catalog is valid
    const validCatalogID = await catalogManager.catalogIDExists(catalogID);
    if (!validCatalogID) return next();

    try {
        const newCatalogID = await catalogManager.copyCatalog(catalogID);

        // send our new catalog's id to client
        return res.send(newCatalogID.toString());
        
    } catch(e) {
        console.error(e);
        return res.sendStatus(500); // Database error
    }

});

/*
    Noah
    GET /catalog/{id}/info
    Gets the id, name, list, and owner entries in JSON format for the specified catalog

    No request body needed

    Example response body:
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
    }
 */
router.get("/*/info", async function(req, res, next) {
    //req.path = /{id}/info
    const catalogID = req.path.split("/")[1];
    //Check that catalog is valid
    const validCatalogID = await catalogManager.catalogIDExists(catalogID);
    if (!validCatalogID) return next();

    //TODO
})

/*
    GET /catalog/{id}
    Renders the catalog viewer page
 */
router.get("/*", async function(req, res, next) {
    //req.path = /{id}/copy
    const catalogID = req.path.split("/")[1];
    //Check that catalog is valid
    const validCatalogID = await catalogManager.catalogIDExists(catalogID);
    if (!validCatalogID) return next();

    res.render("CatalogViewPage");
})

module.exports = router;