const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");
const userManager = require("../../userManager");

test('POST /login/check', async (done) => {
    const credentials = {
        "Name": "benl",
        "Password": "1234"
    };

    const response = await request(app)
        .post("/login/check")
        .send(credentials);

    const isValidLogin = await authorization.areValidCredentials(credentials.Name, credentials.Password);
    if (isValidLogin) {
        expect(response["status"]).toEqual(200) //response code 200
    } else {
        expect(response["status"]).toEqual(403) //response code 403
    }

    return done();
});