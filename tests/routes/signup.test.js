const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");

test('POST /signup/new-user', async (done) => {
    const credentials = {
        "Name": "benl",
        "Password": "1234"
    };
    let response = await request(app)
        .post("/signup/new-user")
        //.set({ Authorization: authorization.getTestKey() })
        .send(credentials);

    //expect(response.header["content-type"]).toEqual(expect.stringContaining("json")); //accept any Content-Type that has json in it
    expect(response["status"] === 200 || response["status"] === 409).toEqual(true) //response code 200 or 409

    return done();
});