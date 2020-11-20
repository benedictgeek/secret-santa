const {
  stringBodyRequired,
  stringBodyNotRequired,
  idBody,
  idParam,
} = require("../../utils/validation_commons");

module.exports.validator = (method) => {
  switch (method) {
    case "create":
      return [
        idBody("groupId"),
        stringBodyNotRequired("title"),
        stringBodyNotRequired("description"),
      ];
    case "fetch":
      return [
        idParam("groupId"),
      ];

    default:
      break;
  }
};
