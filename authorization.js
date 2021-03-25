const bcrypt = require("bcrypt");

async function areValidCredentials(username, password) {
    const userManager = require("./userManager");
    const id = await userManager.getID(username);
    const hash = await userManager.getHashedPassword(id);
    return bcrypt.compare(password, hash);
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

module.exports = {
    areValidCredentials: areValidCredentials,
    hashPassword: hashPassword
}