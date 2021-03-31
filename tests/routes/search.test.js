const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");

test('POST /search/list', async (done) => {
    let response = await request(app)
        .post("/search/list")
        //.set({ Authorization: authorization.getTestKey() })
        .send({
            "Query": "My ",
            "Order": "ascending"
        })

    expect(response["header"]["content-type"]).toEqual(expect.stringContaining("json"));
    for (const catalog of response["body"]) {
        expect("Catalog_ID" in catalog).toBe(true);
        expect("Name" in catalog).toBe(true);
        expect("Links" in catalog).toBe(true);
        expect("User_ID" in catalog).toBe(true);

        for (const link of catalog["Links"]) {
            expect("Entry_ID" in link).toBe(true);
            expect("URL" in link).toBe(true);
            expect("Description" in link).toBe(true);
            expect("Date_Added" in link).toBe(true);
        }
    }

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});