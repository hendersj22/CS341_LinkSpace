const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");

test('POST /following/users', async (done) => {
    let response = await request(app)
        .post("/following/users")
        //.set({ Authorization: authorization.getTestKey() })
        .send({
            "SortBy": "Date_Followed",
            "Order": "ascending"
        });

    expect(response["header"]["content-type"]).toEqual(expect.stringContaining("json"));
    for (const user of response["body"]) {
        expect("User_ID" in user).toBe(true);
        expect("Name" in user).toBe(true);
        expect("Date_Followed" in user).toBe(true);
    }

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});