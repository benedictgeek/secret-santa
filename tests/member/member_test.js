const request = require("supertest");
module.exports.memberTests = (app) => () => {
  it("should create one group with new email", async () => {
    let members = [
      { name: "member one", email: "one@me.com" },
      { name: "member two", email: "two@me.com" },
    ];
    const res = await request(app)
      .post(`/members/add`)
      .send({
        groupId: process.env.GROUP_ID,
        members,
      })
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.length).toBe(2);
  });

  it("should delete one member", async () => {
    const res = await request(app)
      .get(`/members/delete/${process.env.GROUP_ID}/two@me.com`)
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
  });

  it("should update one member", async () => {
    let email = "one@me.com";
    let name = "new name";
    const res = await request(app)
      .post(`/members/update`)
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`)
      .send({ email: email, name: name, groupId: process.env.GROUP_ID });
 
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.email).toBe(email);
    expect(data.name).toBe(name);
  });
};
