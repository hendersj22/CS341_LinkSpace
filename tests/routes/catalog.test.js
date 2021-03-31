const request = require("supertest");
const app = require('../../app');
const authorization = require("../../authorization");

test('POST /catalog/list', async (done) => {

    let response = await request(app)
        //.set({ Authorization: authorization.getTestKey() })
        .post("/catalog/list");

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


test('POST /catalog/create', async (done) => {
    let response = await request(app)
        .post("/catalog/create")
        //.set({ Authorization: authorization.getTestKey() })
        .send({
            Name: "test-catalog",
            Links:
                [
                    {
                        "URL": "www.google.com",
                        "Description": "Favorite search engine",
                    },
                    {
                        "URL": "learning.up.edu",
                        "Description": "School Work",
                    }
               ]
        });

    //expect(response.header["content-type"]).toEqual(expect.stringContaining("json")); //accept any Content-Type that has json in it
    expect(isNaN(response["text"])).toBe(false);
    expect(response["status"]).toEqual(200) //response code 200

    return done();
});


test('POST /catalog/{id}/edit', async (done) => {
    let response = await request(app)
        .post("/catalog/0/edit")
        //.set({ Authorization: authorization.getTestKey() })
        .send({
            Name: "test-catalog-2",
            Links:
                [
                    {
                        "Entry_ID": 0,
                        "Description": "Favorite search engine2",
                        "URL": "www.google.com2",
                    },
                    {
                        "Entry_ID": 1,
                        "Description": "Quizlet2",
                        "URL": "www.quizet.com2",
                    },
                    {
                        "Description": "Moodle (new)",
                        "URL": "www.learning.up.edu",
                    }
                ]
        });

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});


test('POST /catalog/{id}/copy', async (done) => {
    let response = await request(app)
        //.set({ Authorization: authorization.getTestKey() })
        .post("/catalog/0/copy");

    //expect(response.header["content-type"]).toEqual(expect.stringContaining("json")); //accept any Content-Type that has json in it
    expect(isNaN(response["text"])).toBe(false);
    expect(response["status"]).toEqual(200) //response code 200

    return done();
});


test('GET /catalog/{id}', async (done) => {
    let response = await request(app)
        //.set({ Authorization: authorization.getTestKey() })
        .get("/catalog/0/info");

    expect(response["header"]["content-type"]).toEqual(expect.stringContaining("json"));

    expect("Catalog_ID" in response["body"]).toBe(true);
    expect("Name" in response["body"]).toBe(true);
    expect("Links" in response["body"]).toBe(true);
    expect("User_ID" in response["body"]).toBe(true);

    expect(response["status"]).toEqual(200) //response code 200

    return done();
});