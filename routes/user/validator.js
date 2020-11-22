const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
  passwordValidator,
  stringParam,
  emailValidatorParam,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "login":
      return [emailValidator("email"), passwordValidator];
    case "resetToken":
      return [emailValidatorParam];
    case "resetPassword":
      return [
        emailValidator("email"),
        stringBodyRequired("resetToken"),
        passwordValidator,
      ];
    case "update":
      return [stringBodyNotRequired("name")];
    default:
      break;
  }
};
