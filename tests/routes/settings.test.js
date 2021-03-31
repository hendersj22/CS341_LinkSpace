const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");

test('GET /settings/list', async (done) => {
    let response = await request(app)
        //.set({ Authorization: authorization.getTestKey() })
        .get("/settings/list");

    expect(response["header"]["content-type"]).toEqual(expect.stringContaining("json"));

    expect("User_ID" in response["body"]).toBe(true);
    expect("Name" in response["body"]).toBe(true);
    expect("Night_Mode" in response["body"]).toBe(true);

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});

test('POST /settings/edit', async (done) => {
    let response = await request(app)
        .post("/settings/edit")
        //.set({ Authorization: authorization.getTestKey() })
        .send({
            "Name": "ben",
            "Password": "newPassword",
            "Night_Mode": true
        })

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});