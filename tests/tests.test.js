const app = require("../app");
const { groupTests } = require("./group/group_test");

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});
beforeEach(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 50));
});

describe("Group Endpoints", groupTests(app));
