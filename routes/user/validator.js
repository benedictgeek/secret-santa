const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
  passwordValidator,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "login":
      return [emailValidator("email"), passwordValidator];

    default:
      break;
  }
};
