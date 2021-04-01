const dbms = require("./dbms_promise");
const authorization = require("./authorization");

// Finds the greatest id in the database, and adds 1 to get a new id
async function getNewUserID() {
    const field = "User_ID";
    const table = "User";
    const results = await dbms.dbquery(`SELECT MAX(${field}) FROM ${table};`);
    const maxId = results[0][`MAX(${field})`];
    if (maxId == null) return 0;
    return maxId + 1;
}

async function createAccount(username, password, status, nightMode, displaySize) {
    const isValidUsername = await usernameExists(username);

    if (isValidUsername) {
        throw Error("Username is taken already");
    }

    const id = await getNewUserID();
    const hash = await authorization.hashPassword(password);
    if (!status) status = 0;
    nightMode = (nightMode === true || nightMode === "true" || nightMode === 1) ? 1 : 0;
    if (displaySize === null || displaySize === undefined) displaySize = "";

    await dbms.dbquery(`INSERT INTO User (User_ID, Name, Password, Status)
                                VALUES (${id}, '${username}', '${hash}', ${status});`);
    await dbms.dbquery(`INSERT INTO Preferences (User_ID, Night_Mode, Display_Size)
                                VALUES (${id}, ${nightMode}, '${displaySize}');`);

    // Example output:
    // id = 5;
    return id;
}

async function updateUsername(id, newUsername) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const isValidUsername = await usernameExists(newUsername);

    if (isValidUsername) {
        throw Error("Username is taken already");
    }

    await dbms.dbquery(`UPDATE User
                                 SET Name = '${newUsername}'
                                 WHERE User_ID = ${id};`);
}

async function updatePassword(id, newPassword) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const hash = await authorization.hashPassword(newPassword);

    await dbms.dbquery(`UPDATE User
                                 SET Password = '${hash}'
                                 WHERE User_ID = ${id};`);

}

async function updateNight_Mode(id, newNight_Mode) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    newNight_Mode = (newNight_Mode === true || newNight_Mode === "true" || newNight_Mode === 1) ? 1 : 0;

    await dbms.dbquery(`UPDATE Preferences
                                 SET Night_Mode = ${newNight_Mode}
                                 WHERE User_ID = ${id};`);
}

async function getID(username) {
    const isValidUsername = await usernameExists(username);

    if (!isValidUsername) {
        throw Error("Invalid username");
    }

    const result = await dbms.dbquery(`SELECT User_ID
                                     FROM User
                                     WHERE Name = '${username}';`);

    // Example output:
    // result[0]["User_ID"] = 4;
    return result[0]["User_ID"];
}

async function getUsername(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const result = await dbms.dbquery(`SELECT Name
                                     FROM User
                                     WHERE User_ID = ${id};`);

    // Example output:
    // result[0]["Name"] = "ben";
    return result[0]["Name"];
}

async function getHashedPassword(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const result = await dbms.dbquery(`SELECT Password
                                 FROM User
                                 WHERE User_ID = ${id};`);

    // Example output:
    // result[0]["Password"] = "4fd323fe6ed7a95a31c5ce43beba1c964c527fd9550e34c504986e2c7d4d2bebab1c2fc6a084edc16fb2e25038a17c6a72c94e23e648c6d48990a6d476619cc7";
    return result[0]["Password"];
}

async function getStatus(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const result = await dbms.dbquery(`SELECT Status
                                 FROM User
                                 WHERE User_ID = ${id};`);

    // Example output:
    // result[0]["Status"] = 0;
    return result[0]["Status"];
}


async function getSettings(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const results = await dbms.dbquery(`SELECT *
                                        FROM Preferences
                                        WHERE User_ID = ${id}`);

    return results;
}


async function getNight_Mode(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const results = await dbms.dbquery(`SELECT Night_Mode
                                    FROM Preferences
                                    WHERE User_ID = ${id};`);
    return results[0]["Night_Mode"] === 1;
}

async function getFollowers(id) {
    const isValidID = await idExists(id);

    if (!isValidID) {
        throw Error("Invalid user id");
    }

    const results = await dbms.dbquery(`SELECT *
                                        FROM Followers
                                        WHERE User_ID = ${id};`);
    return results;
}

async function isFollowingUser(currentID, followerID) {
    const isValidID = await idExists(currentID) && await idExists(followerID);

    if (!isValidID) {
        throw Error("Invalid user or follower id");
    }

    const results = await dbms.dbquery(`SELECT FROM Followers
                                        WHERE User_ID = ${currentID} AND Follower_ID = ${followerID};`);
    return results > 0;
}

async function followUser(currentID, followerID) {
    const isValidID = await idExists(currentID) && await idExists(followerID);

    if (!isValidID) {
        throw Error("Invalid user or follower id");
    }

    //Date format in unix format
    const dateFollowed = Date.now();

    const alreadyFollowed = await isFollowingUser(currentID, followerID);
    if (!alreadyFollowed) {
        await dbms.dbquery(`INSERT INTO Followers (User_ID, Follower_ID, Date_Followed)
                                (${currentID}, ${followerID}, ${dateFollowed})`);
    }
}

async function unfollowUser(currentID, followerID) {
    const isValidID = await idExists(currentID) && await idExists(followerID);

    if (!isValidID) {
        throw Error("Invalid user or follower id");
    }

    await dbms.dbquery(`DELETE FROM Followers
                                WHERE User_ID = ${currentID} AND Follower_ID = ${followerID}`);

}

async function idExists(id) {
    if (id === null || id === undefined || isNaN(id)) return false;
    const result = await dbms.dbquery(`SELECT * FROM User WHERE User_ID = ${id}`);
    return result.length > 0;
}

async function usernameExists(username) {
    if (username === null || username === undefined) return false;
    const result = await dbms.dbquery(`SELECT * FROM User WHERE Name = '${username}'`);
    return result.length > 0;
}

module.exports = {
    getNewUserID: getNewUserID,
    createAccount: createAccount,
    updateUsername: updateUsername,
    updatePassword: updatePassword,
    updateNight_Mode: updateNight_Mode,
    getID: getID,
    getUsername: getUsername,
    getHashedPassword: getHashedPassword,
    getStatus: getStatus,
    getNight_Mode: getNight_Mode,
    getFollowers: getFollowers,
    isFollowingUser: isFollowingUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    idExists: idExists,
    usernameExists: usernameExists
}