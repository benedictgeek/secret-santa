const request = require("supertest");
module.exports.groupTests = (app) => () => {
  it("should create one group with new email", async () => {
    let title = "Algorism";
    let email = "test@me.com";
    let password = "password12345";
    let name = " Olushola Ben";
    const res = await request(app).post(`/groups/create`).send({
      title,
      name,
      email,
      password,
    });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.user.email).toBe(email);
    expect(data.group.title).toBe(title);
    expect(data.token).not.toBeNull();
    process.env.GROUP_ID = data.group.id;
    process.env.BEARER_TOKEN = data.token;
  });
  it("should get all user(admin) groups", async () => {
    const res = await request(app)
      .get(`/groups/get-groups`)
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.length).toBe(1);
  });
};
