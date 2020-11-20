const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
  passwordValidator,
  stringParam,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "login":
      return [emailValidator("email"), passwordValidator];
    case "resetToken":
      return [stringParam("token")];
    case "resetPassword":
      return [emailValidator("email"), passwordValidator];
    case "update":
      return [stringBodyNotRequired("name")];
    default:
      break;
  }
};
