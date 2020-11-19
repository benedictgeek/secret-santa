const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "create":
      return [
        emailValidator("email"),
        stringBodyRequired("title"),
        stringBodyNotRequired("name"),
        passwordValidatorNotRequired,
      ];

    default:
      break;
  }
};
