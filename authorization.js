const crypto = require("crypto");

async function isValidPassword(id, password) {
    const userManager = require("./userManager");
    const hash = await hashPassword(password);
    const correctHash = await userManager.getHashedPassword(id);
    return hash === correctHash;
}

async function areValidCredentials(username, password) {
    const userManager = require("./userManager");
    const id = userManager.getID(username);
    return isValidPassword(id, password);
}

async function hashPassword(password) {
    return new Promise( (resolve, reject) => {
        // Salt of all zeros, not very secure, but there is no column in the database for salt
        const salt = Buffer.alloc(16).toString("hex");
        crypto.pbkdf2(password, salt, 1000, 64, "sha512", function(err, derivedKey) {
            if (!err) {
                resolve(derivedKey.toString("hex"));
            } else {
                reject(err);
            }
        });
    });
}

module.exports = {
    areValidCredentials: areValidCredentials,
    hashPassword: hashPassword
}