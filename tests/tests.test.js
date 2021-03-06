const app = require('../app');
const { afterAllTests } = require('./after_all/after_all');
const { groupTests } = require('./group/group_test');
const { memberTests } = require('./member/member_test');
const { santaTests } = require('./santa/santa_test');
const { userTests } = require('./user/user_test');

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});
beforeEach(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 50));
});

describe('Group Endpoints', groupTests(app));
describe('User Endpoints', userTests(app));
describe('Member Endpoints', memberTests(app));
describe('Santa Endpoints', santaTests(app));

//this should run last
describe('Miscellaneous Endpoints', afterAllTests(app));
