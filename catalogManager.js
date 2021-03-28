const dbms = require("./dbms_promise");

async function createCatalog(name, links, userID) {
    const userManager = require("./userManager");

    const isValidUserID = await userManager.idExists(userID);

    if (!isValidUserID) {
        throw Error("Invalid user id");
    }

    //Generate a new catalog id
    const catalogID = await getNewCatalogID();

    //Insert the catalog entry into the database
    await dbms.dbquery(`INSERT INTO Catalog (Catalog_ID, Name, User_ID)
                                VALUES (${catalogID}, '${name}', ${userID});`);

    await createLinks(catalogID, links);

    // Example output:
    // catalogID = 4;
    return catalogID;
}

async function createLinks(catalogID, links) {
    //Add all the links into the database, so we need to iterate through all the links in body args
    //Example: links = {"Link Description 1" : "link1.com", "Link Description 2": "link2.com"}

    for (const description of Object.keys(links)) {
        //Get the url
        const url = links[description];
        await createLink(catalogID, url, description);
    }
}

async function createLink(catalogID, url, description) {
    const isValidCatalogID = await catalogIDExists(catalogID);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Generate a new link id
    const linkID = await getNewListEntryID();

    //Date format in unix format
    const dateAdded = Date.now();

    //Insert the list entry into the database
    await dbms.dbquery(`INSERT INTO List_Entry (Entry_ID, URL, Description, Date_Added, Catalog_ID)
                                 VALUES (${linkID}, '${url}', '${description}', ${dateAdded}, ${catalogID});`);

    // Example output:
    // linkID = 4;
    return linkID;
}

async function copyCatalog(catalogID) {
    //Copy the Catalog entry
    const newCatalogID = await getNewCatalogID();
    await dbms.dbquery(`INSERT INTO Catalog (Catalog_ID, Name)
                            SELECT '${newCatalogID}', Name
                            FROM Catalog
                            WHERE Catalog_ID = '${catalogID}';`);

    await copyListEntries(catalogID, newCatalogID);

    return newCatalogID;
}

async function copyListEntries(catalogID, newCatalogID) {
    //Copy all the list entries for each list
    const listEntries = await dbms.dbquery(`SELECT *
                                                    FROM List_Entry
                                                    WHERE Catalog_ID = '${catalogID}';`);
    for (let listEntry of listEntries) {
        const currentListEntryID = listEntry["Entry_ID"];
        const newEntryListID = await getNewListEntryID();

        await dbms.dbquery(`INSERT INTO List_Entry (Entry_ID, URL, Description, Date_Added, Catalog_ID)
                                    SELECT '${newEntryListID}', URL, Description, Date_Added, '${newCatalogID}'
                                    FROM List_Entry
                                    WHERE Entry_ID = '${currentListEntryID}';`);
    }
}

// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewCatalogID() {
    const field = "Catalog_ID";
    const table = "Catalog";
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    if (results.length === 0) return 0;
    const maxId = results[0][`MAX(${field})`];
    return maxId + 1;
}

// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewListEntryID() {
    const field = "Entry_ID";
    const table = "List_Entry";
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    if (results.length === 0) return 0;
    const maxId = results[0][`MAX(${field})`];
    return maxId + 1;
}

async function getCatalog(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);


    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Links"] = await getListEntries(catalogID);
    }

    /* Example output:
       result[0] =
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
    return result[0];
}

async function getCatalogsByUser(userID, order) {
    const userManager = require("./userManager");

    const isValidUserID = await userManager.idExists(userID);

    if (!isValidUserID) {
        throw Error("Invalid user id");
    }

    if (order === "descending") {
        order = "DESC"
    } else {
        order = "ASC"
    }

    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 WHERE User_ID = ${userID}
                                 ORDER BY Name ${order};`);

    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Links"] = await getListEntries(catalogID);
    }

    /* Example output:
       result =
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
          }
        ]
     */
    return result;
}

async function getName(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    const result = await dbms.dbquery(`SELECT Name
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);

    // Example output:
    // result[0]["Name"] = "My Catalog 1";
    return result[0]["Name"];
}

async function getOwner(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    const result = await dbms.dbquery(`SELECT User_ID
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);

    // Example output:
    // result[0]["User_ID"] = 0;
    return result[0]["User_ID"];
}

async function getListEntries(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    const result = await dbms.dbquery(`SELECT *
                                 FROM List_Entry
                                 WHERE Catalog_ID = ${id}
                                 ORDER BY Date_Added;`);

    // Example output:
    // result = [
    //      {"Entry_ID": 0, "URL": "www.quizlet.com", "Description": "Quizlet", "Date_Added": 1616535637203},
    //      {"Entry_ID": 1, "URL": "learning.up.edu", "Description": "Moodle", "Date_Added": 1616535637446}
    // ];
    return result;
}

async function updateName(id, newName) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    await dbms.dbquery(`UPDATE Catalog
                                 SET Name = '${newName}'
                                 WHERE Catalog_ID = ${id}`);
}

// Helper method for updateLinks
async function updateLink(id, newURL, newDesc){
    const isValidLinkID = await linkIDExists(id);

    if (!isValidLinkID) {
        throw Error("Invalid link id");
    }

    // Update individual link in "Links" array
    await dbms.dbquery(`UPDATE List_Entry
                        SET URL = '${newURL}', Description = '${newDesc}'
                        WHERE Entry_ID = ${id}`);


}

async function updateLinks(newLinks){
    //TO DO: call updateLink (function above)
    //TO DO: Set links and new desc (using a For Each Loop)
    // for of loop <---- 
}


async function catalogIDExists(id) {
    if (id === null || id === undefined || isNaN(id)) return false;
    const result = await dbms.dbquery(`SELECT * FROM Catalog WHERE Catalog_ID = ${id}`);
    return result.length > 0;
}

async function linkIDExists(id) {
    if (id === null || id === undefined || isNaN(id)) return false;
    const result = await dbms.dbquery(`SELECT * FROM Link_Entry WHERE Entry_ID = ${id}`);
    return result.length > 0;
}

async function search(query, order) {
    if (order === "descending") {
        order = "DESC"
    } else {
        order = "ASC"
    }

    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 WHERE Name LIKE '%${query}%'
                                 ORDER BY Name ${order};`);
    // Example output:
    // result = [
    //      {"Catalog_ID": 0, "Name": "My Catalog 1", "User_ID": 2},
    //      {"Catalog_ID": 1, "Name": "My Catalog 2", "User_ID": 3}
    // ];
    return result;
}


module.exports = {
    copyCatalog: copyCatalog,
    createCatalog: createCatalog,
    createLink: createLink,
    getNewCatalogID: getNewCatalogID,
    getNewListEntryID: getNewListEntryID,
    getCatalog: getCatalog,
    getCatalogsByUser: getCatalogsByUser,
    getName: getName,
    getOwner: getOwner,
    getListEntries: getListEntries,
    updateName: updateName,
    updateLinks: updateLinks,
    catalogIDExists: catalogIDExists,
    linkIDExists: linkIDExists,
    search: search

}