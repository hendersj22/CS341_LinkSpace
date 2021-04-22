const dbms = require("./dbms_promise");
const mysql = require("mysql");

async function createCatalog(name, links, userID) {
    const userManager = require("./userManager");

    //Check that ID is valid
    const isValidUserID = await userManager.idExists(userID);

    if (!isValidUserID) {
        throw Error("Invalid user id");
    }

    //Generate a new catalog id
    const catalogID = await getNewCatalogID();

    //Prevent SQL Injection
    name = mysql.escape(name);
    userID = mysql.escape(userID);

    //Insert the catalog entry into the database
    await dbms.dbquery(`INSERT INTO Catalog (Catalog_ID, Name, User_ID)
                                VALUES (${catalogID}, ${name}, ${userID});`);

    // Insert our links into the database
    await createLinks(catalogID, links);

    // Example output:
    // catalogID = 4;
    return catalogID;
}

async function deleteCatalog(catalogID, userID) {
    const userManager = require("./userManager");

    //Check that userID and catalogID is valid
    const isValidUserID = await userManager.idExists(userID);
    const isValidCatalogID = await catalogIDExists(catalogID);

    if (!isValidUserID) {
        throw Error("Invalid user id");
    }
    
    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }


    //Delete the catalog entry from the database
    await dbms.dbquery(`DELETE FROM Catalog WHERE Catalog_ID={$catalogID} AND User_ID={$userID}`);
}

/*
    Example links argument:
    links = [
        {
            "URL": "www.google.com",
            "Description": "Favorite search engine",
        },
        {
            "URL": "learning.up.edu",
            "Description": "School Work",
        }
    ]
*/
async function createLinks(catalogID, links) {
    for (const link of links) {
        //Get the description and url
        const description = link["Description"];
        const url = link["URL"];
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

    //Prevent SQL Injection
    catalogID = mysql.escape(catalogID);
    url = mysql.escape(url);
    description = mysql.escape(description);

    //Insert the list entry into the database
    await dbms.dbquery(`INSERT INTO List_Entry (Entry_ID, URL, Description, Date_Added, Catalog_ID)
                        VALUES (${linkID}, ${url}, ${description}, ${dateAdded}, ${catalogID});`);

    // Example output:
    // linkID = 4;
    return linkID;
}

async function copyCatalog(catalogID, userID) {
    const userManager = require("./userManager");

    const isValidID = await userManager.idExists(userID);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    //Copy the Catalog entry
    const newCatalogID = await getNewCatalogID();

    //Prevent SQL Injection
    catalogID = mysql.escape(catalogID);
    userID = mysql.escape(userID);

    await dbms.dbquery(`INSERT INTO Catalog (Catalog_ID, Name, User_ID)
                        SELECT ${newCatalogID}, Name, ${userID}
                        FROM Catalog
                        WHERE Catalog_ID = ${catalogID};`);

    // Copy the links in List_Entry table
    await copyListEntries(catalogID, newCatalogID);

    return newCatalogID;
}

async function copyListEntries(catalogID, newCatalogID) {
    // Gets all list entries to copy
    const listEntries = await dbms.dbquery(`SELECT *
                                            FROM List_Entry
                                            WHERE Catalog_ID = ${catalogID};`);

    // Copy each list entry
    for (let listEntry of listEntries) {
        const currentListEntryID = listEntry["Entry_ID"];
        const newEntryListID = await getNewListEntryID();

        await dbms.dbquery(`INSERT INTO List_Entry (Entry_ID, URL, Description, Date_Added, Catalog_ID)
                            SELECT ${newEntryListID}, URL, Description, Date_Added, ${newCatalogID}
                            FROM List_Entry
                            WHERE Entry_ID = ${currentListEntryID};`);
    }
}

// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewCatalogID() {
    const field = "Catalog_ID";
    const table = "Catalog";
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    const maxId = results[0][`MAX(${field})`];
    // If no entries in Catalog table, our ID is 0.
    if (maxId == null) return 0;
    return maxId + 1;
}

// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewListEntryID() {
    const field = "Entry_ID";
    const table = "List_Entry";
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    const maxId = results[0][`MAX(${field})`];
    // If no entries in List_Entry table, our ID is 0.
    if (maxId == null) return 0;
    return maxId + 1;
}

async function getCatalog(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);

    // Get information for the specified catalog
    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);

    // Get link information for that catalog
    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Author"] = await getAuthor(catalogID);
        result[row]["Links"] = await getListEntries(catalogID);
    }

    /* Example output:
       result[0] =
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

     */
    return result[0];
}

async function getCatalogsByUser(userID, order) {
    const userManager = require("./userManager");

    const isValidUserID = await userManager.idExists(userID);

    if (!isValidUserID) {
        throw Error("Invalid user id");
    }

    // Order the catalogs by name descending or ascending
    if (order === "descending") {
        order = "DESC"
    } else {
        order = "ASC"
    }

    //Prevent SQL Injection
    userID = mysql.escape(userID);

    // Gets all catalogs created by the specified user
    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 WHERE User_ID = ${userID}
                                 ORDER BY Name ${order};`);

    // Gets the links for each of those catalogs
    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Author"] = await getAuthor(catalogID);
        result[row]["Links"] = await getListEntries(catalogID);
    }

    /* Example output:
       result =
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
     */
    return result;
}

async function getTrendingCatalogs(order) {
    // Order the catalogs by name descending or ascending
    if (order === "descending") {
        order = "DESC"
    } else {
        order = "ASC"
    }

    // Get most recent catalogs
    const result = await dbms.dbquery(`SELECT *
                                 FROM Catalog
                                 ORDER BY Catalog_ID DESC, Name ${order}
                                 LIMIT 15;`);

    // Gets the links for each of those catalogs
    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Links"] = await getListEntries(catalogID);
    }

    return result;
}

async function getName(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);

    // Get the catalog's name
    const result = await dbms.dbquery(`SELECT Name
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);

    // Example output:
    // result[0]["Name"] = "My Catalog 1";
    return result[0]["Name"];
}

async function getAuthor(id) {
    const userManager = require("./userManager");

    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);

    // Gets the catalog owner's id
    const result = await dbms.dbquery(`SELECT User_ID
                                 FROM Catalog
                                 WHERE Catalog_ID = ${id};`);

    const userID = result[0]["User_ID"];
    const username = await userManager.getUsername(userID);
    // Example output:
    // username = "benl";
    return username;
}

async function getListEntries(id) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);

    // Retrieves link information from the specified catalog
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

// Updates a catalog name
async function updateName(id, newName) {
    const isValidCatalogID = await catalogIDExists(id);

    if (!isValidCatalogID) {
        throw Error("Invalid catalog id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);
    newName = mysql.escape(newName);

    await dbms.dbquery(`UPDATE Catalog
                        SET Name = ${newName}
                        WHERE Catalog_ID = ${id}`);
}

// Helper method for updateLinks
// Updates a single List entry with a new URl and new description
async function updateLink(id, newDesc, newURL){
    const isValidLinkID = await linkIDExists(id);

    if (!isValidLinkID) {
        throw Error("Invalid link id");
    }

    //Prevent SQL Injection
    id = mysql.escape(id);

    // Update description if newDesc isn't null or undefined
    if (newDesc) {
        //Prevent SQL Injection
        newDesc = mysql.escape(newDesc);

        await dbms.dbquery(`UPDATE List_Entry
                        SET Description = ${newDesc}
                        WHERE Entry_ID = ${id}`);
    }

    // Update URL if newURL isn't null or undefined
    if (newURL) {
        //Prevent SQL Injection
        newURL = mysql.escape(newURL);

        await dbms.dbquery(`UPDATE List_Entry
                        SET URL = ${newURL}
                        WHERE Entry_ID = ${id}`);
    }

}

// Function that takes an array newLinks and updates its description and url
async function updateLinks(catalogID, newLinks){
    // Iterate through every link in "newLinks" array
    for (const link of newLinks){
        // Get description, url, and id from each link
        const description = link["Description"];
        const url = link["URL"];
        const id = link["Entry_ID"];

        // If "Entry_ID is null" (link is a new entry)
        if (id === undefined || id === null) {
            // Create a newLink with the description and url
            await createLink(catalogID,description,url);
        }else{
            // Call updatelink method with new description and url
            await updateLink(id,description,url);
        }
    }
}

async function catalogIDExists(id) {
    // Checks that the specified catalog id is in the database
    if (id === null || id === undefined || isNaN(id)) return false;
    //Prevent SQL Injection
    id = mysql.escape(id);
    const result = await dbms.dbquery(`SELECT * FROM Catalog WHERE Catalog_ID = ${id}`);
    return result.length > 0;
}

async function linkIDExists(id) {
    // Checks that the specified link id is in the database
    if (id === null || id === undefined || isNaN(id)) return false;
    //Prevent SQL Injection
    id = mysql.escape(id);
    const result = await dbms.dbquery(`SELECT * FROM List_Entry WHERE Entry_ID = ${id}`);
    return result.length > 0;
}

async function search(query, order) {
    if (order === "descending") {
        order = "DESC"
    } else {
        order = "ASC"
    }

    //Prevent SQL Injection
    query = mysql.escape(`%${query}%`);


    /* Search catalogs that match a catalog name,
       URLs and descriptions of links in a catalog,
       and owner name
     */
    const result = await dbms.dbquery(`SELECT Catalog.*
                                        FROM Catalog INNER JOIN User INNER JOIN List_Entry
                                        ON Catalog.User_ID = User.User_ID AND Catalog.Catalog_ID = List_Entry.Catalog_ID
                                        WHERE Catalog.Name LIKE ${query}
                                            OR User.Name LIKE ${query}
                                            OR List_Entry.URL LIKE ${query}
                                            OR List_Entry.Description LIKE ${query}
                                        GROUP BY Catalog_ID, Name
                                        ORDER BY Name ${order};`);

    // Get author information for that catalog
    for (let row = 0; row < result.length; row++) {
        const catalogID = result[row]["Catalog_ID"];
        result[row]["Author"] = await getAuthor(catalogID);
    }

    // Example output:
    // result = [
    //      {"Catalog_ID": 0, "Name": "My Catalog 1", "User_ID": 2, "Author": "benl"},
    //      {"Catalog_ID": 1, "Name": "My Catalog 2", "User_ID": 3, "Author": "benl"}
    // ];
    return result;
}


module.exports = {
    copyCatalog: copyCatalog,
    createCatalog: createCatalog,
    deleteCatalog: deleteCatalog,
    createLink: createLink,
    getNewCatalogID: getNewCatalogID,
    getNewListEntryID: getNewListEntryID,
    getCatalog: getCatalog,
    getCatalogsByUser: getCatalogsByUser,
    getTrendingCatalogs: getTrendingCatalogs,
    getName: getName,
    getAuthor: getAuthor,
    getListEntries: getListEntries,
    updateName: updateName,
    updateLinks: updateLinks,
    catalogIDExists: catalogIDExists,
    linkIDExists: linkIDExists,
    search: search

}