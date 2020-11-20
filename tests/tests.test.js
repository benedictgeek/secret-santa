const app = require("../app");
const { groupTests } = require("./group/group_test");
const { memberTests } = require("./member/member_test");
const { userTests } = require("./user/user_test");

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});
beforeEach(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 50));
});

describe("Group Endpoints", groupTests(app));
describe("User Endpoints", userTests(app));
describe("Member Endpoints", memberTests(app));
