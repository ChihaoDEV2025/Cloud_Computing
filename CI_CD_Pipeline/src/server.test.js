//Unit test running by JEST
const { greet } = require("./server");

test("greet returns a greeting", () => {
  expect(greet("CI/CD")).toBe("Hello, CI/CD!");
});
