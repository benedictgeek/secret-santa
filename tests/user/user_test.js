const request = require('supertest');
module.exports.userTests = (app) => () => {
  it('should log a user in', async () => {
    let email = 'test@me.com';
    let password = 'password12345';
    const res = await request(app).post(`/users/login`).send({
      email,
      password,
    });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    process.env.BEARER_TOKEN = data.token;
  });

  it('should update a user info', async () => {
    let name = 'new name';
    let email = 'test@me.com';
    const res = await request(app).post(`/users/update`).send({
      email,
      name,
    });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.name).toBe(name);
  });

  it('should get reset token', async () => {
    let email = 'test@me.com';
    const res = await request(app).get(`/users/get-reset-token/${email}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.email).toBe(email);
    process.env.RESET_TOKEN = data.passwordResetToken;
  });

  it('should reset password', async () => {
    let email = 'test@me.com';
    let password = 'new_password';
    const res = await request(app)
      .post(`/users/reset-password`)
      .send({ email, password, resetToken: process.env.RESET_TOKEN });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    expect(data.email).toBe(email);
  });

  it('should re login to test newly changed password', async () => {
    let email = 'test@me.com';
    let password = 'new_password';
    const res = await request(app).post(`/users/login`).send({
      email,
      password,
    });
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
    process.env.BEARER_TOKEN = data.token;
  });
  it('should check if a user exists', async () => {
    let email = 'test@me.com';
    const res = await request(app).get(`/users/check/${email}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(200);
  });
  it('should check if a user does not exists', async () => {
    let email = 'testtt@me.com';
    const res = await request(app).get(`/users/check/${email}`);
    let data = res.body.data;
    expect(res.statusCode).toEqual(404);
  });
};
