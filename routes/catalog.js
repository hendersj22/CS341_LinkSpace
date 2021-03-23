const express = require("express");
const dbms = require("../dbms_promise");
const router = express.Router();
const jade = require("jade");


// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewId(field, table) {
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    const maxId = results[0][`MAX(${field})`];
    return maxId + 1;
}

router.get("/", function(req, res, next) {
    res.render("CatalogViewPage");
});

router.get("/create", function(req, res, next) {
    res.render("catalogCreation");
});

router.post("/create", async function(req, res, next) {
    //get name, links, etc. from client
    //call database
    //send response back
});

router.get("/*/edit", function(req, res, next) {
    res.render("EditingCatalog");
})

router.post("/*/edit", async function(req, res, next) {
    //req.path = /{id}/copy
    const currentCatalogId = req.path.split("/")[1];

    //update database here
});

//Post handler for urls catalog/{id}/copy
router.post("/*/copy", async function(req, res, next) {
    //req.path = /{id}/copy
    const currentCatalogId = req.path.split("/")[1];

    try {
        //Copy the Catalog entry
        const newCatalogId = await getNewId("Catalog_ID", "Catalog");
        await dbms.dbquery(`INSERT INTO Catalog (Catalog_ID, Name)
                            SELECT '${newCatalogId}', Name
                            FROM Catalog
                            WHERE Catalog_ID = '${currentCatalogId}';`);


            //Copy all the list entries for each list
            const listEntries = await dbms.dbquery(`SELECT *
                                                    FROM List_Entry
                                                    WHERE Catalog_ID = '${currentCatalogId}';`);
            for (let listEntry of listEntries) {
                const currentListEntryId = listEntry["Entry_ID"];
                const newEntryListId = await getNewId("Entry_ID", "List_Entry");

                await dbms.dbquery(`INSERT INTO List_Entry (Entry_ID, URL, Description, Date_Added, Catalog_ID)
                                    SELECT '${newEntryListId}', URL, Description, Date_Added, '${newCatalogId}'
                                    FROM List_Entry
                                    WHERE Entry_ID = '${currentListEntryId}';`);
            }



        // send our new catalog's id to client
        return res.send(newCatalogId.toString());
        
    } catch(e) {
        console.error(e);
        return res.sendStatus(500); // Database error
    }

});

module.exports = router;