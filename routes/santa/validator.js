const {
  stringBodyRequired,
  stringBodyNotRequired,
  idBody,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "create":
      return [
        idBody("groupId"),
        stringBodyNotRequired("title"),
        stringBodyNotRequired("description"),
      ];

    default:
      break;
  }
};
