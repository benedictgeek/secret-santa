const { body } = require("express-validator");
const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
  idBody,
  idParam,
  emailValidatorParam,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "add":
      return [
        idBody("groupId"),
        body("members").isArray().withMessage("Please provide members array"),
        stringBodyRequired("member.*.name"),
        emailValidator("member.*.email"),
      ];
    case "delete":
      return [idParam("groupId"), emailValidatorParam];
    case "update":
      return [stringBodyNotRequired("name")];
    default:
      break;
  }
};
