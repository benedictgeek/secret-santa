const request = require('supertest');
module.exports.afterAllTests = (app) => () => {
  it('should delete a santa event', async () => {
    const res = await request(app)
      .get(`/santas/delete/${process.env.GROUP_ID}/${process.env.SANTA_ID}`)
      .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.status).toBe('deleted');
  });
  it('should delete a group', async () => {
    const res = await request(app)
      .get(`/groups/delete/${process.env.GROUP_ID}`)
      .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);

    expect(data.status).toBe('deleted');
  });
};
