const {
  emailValidator,
  stringBodyRequired,
  passwordValidatorNotRequired,
  stringBodyNotRequired,
  idBody,
  idParam,
} = require('../../utils/validation_commons');

module.exports.validator = (method) => {
  switch (method) {
    case 'create':
      return [
        emailValidator('email'),
        stringBodyRequired('title'),
        stringBodyNotRequired('name'),
        passwordValidatorNotRequired,
      ];
    case 'update':
      return [
        idBody('groupId'),
        stringBodyNotRequired('title'),
        stringBodyNotRequired('description'),
      ];
    case 'delete':
      return [
        idParam('groupId'),
      ];
    default:
      break;
  }
};
