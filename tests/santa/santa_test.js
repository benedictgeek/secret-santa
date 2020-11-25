const request = require("supertest");
module.exports.santaTests = (app) => () => {
  it("should not create one santa event if members less than three", async () => {
    let title = "Test one";
    let description = "This is for testing";
    const res = await request(app)
      .post(`/santas/create`)
      .send({
        title,
        description,
        groupId: process.env.GROUP_ID,
      })
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(403);
  });
  it("should add two more members to group", async () => {
    let members = [
      { name: "member three", email: "three@me.com" },
      { name: "member four", email: "four@me.com" },
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
  });
  it("should create one santa event if members are enough", async () => {
    let title = "Test one";
    let description = "This is for testing";
    const res = await request(app)
      .post(`/santas/create`)
      .send({
        title,
        description,
        groupId: process.env.GROUP_ID,
      })
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.title).toBe(title);
    expect(data.description).toBe(description);
    process.env.SANTA_ID = data.id;
  });
  it("should fetch all santa events", async () => {
    const res = await request(app)
      .get(`/santas/get-all/${process.env.GROUP_ID}`)
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.length).toBe(1);
  });
  it("should send a mail invite to members", async () => {
    let emails = ["one@me.com"];
    const res = await request(app)
      .post(`/santas/send-invite`)
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`)
      .send({
        santaId: process.env.SANTA_ID,
        groupId: process.env.GROUP_ID,
        emails,
      });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
  });
  // it('should not perform a santa pair when members is less than two', async () => {
  //   console.log('TOKENS', process.env.MEMBER_TOKENS);
  //   const res = await request(app).get(
  //     `/santas/pair/${JSON.parse(process.env.MEMBER_TOKENS)[0]}`
  //   );
  //   let data = res.body.data;
  //   expect(res.statusCode).toEqual(403);
  // });

  it("should perform a santa pair", async () => {
    console.log("TOKENS", process.env.MEMBER_TOKENS);
    const res = await request(app).get(
      `/santas/pair/${JSON.parse(process.env.MEMBER_TOKENS)[0]}`
    );
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.provider).not.toBeNull();
    expect(data.recipient).not.toBeNull();
  });
  it("should update one santa event info", async () => {
    let groupId = process.env.GROUP_ID;
    let santaId = process.env.SANTA_ID;
    let title = "new title";
    let description = "new desc";
    const res = await request(app)
      .post(`/santas/update`)
      .send({ groupId, santaId, title, description })
      .set("Authorization", `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.title).toBe(title);
    expect(data.description).toBe(description);
  });
};
