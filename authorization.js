const bcrypt = require("bcrypt");
const createError = require("http-errors");

async function areValidCredentials(username, password) {
    const userManager = require("./userManager");
    try {
        const id = await userManager.getID(username);
        const hash = await userManager.getHashedPassword(id);
        return bcrypt.compare(password, hash);
    } catch {
        return false;
    }
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

function getLoggedInUser(req) {
    if (req.session && req.session["User_ID"]) {
        return req.session["User_ID"];
    }
}

async function doAuthorization(req, res, next) {
    if (req.session && req.session.id) {
        return next();
    }
    return res.redirect("/login");
}

module.exports = {
    areValidCredentials: areValidCredentials,
    hashPassword: hashPassword,
    getLoggedInUser: getLoggedInUser,
    doAuthorization: doAuthorization
}