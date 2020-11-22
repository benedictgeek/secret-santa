const { body } = require('express-validator');
const {
  stringBodyRequired,
  stringBodyNotRequired,
  idBody,
  idParam,
  stringParam,
  emailValidator,
} = require('../../utils/validation_commons');

module.exports.validator = (method) => {
  switch (method) {
    case 'create':
      return [
        idBody('groupId'),
        stringBodyNotRequired('title'),
        stringBodyNotRequired('description'),
      ];
    case 'fetch':
      return [idParam('groupId')];
    case 'pair':
      return [stringParam('token')];
    case 'sendInvite':
      return [
        idBody('groupId'),
        idBody('santaId'),
        body('emails').isArray().withMessage('Please provide emails array'),
        emailValidator('emails.*'),
      ];
    case 'update':
      return [
        idBody('groupId'),
        idBody('santaId'),
        stringBodyNotRequired('title'),
        stringBodyNotRequired('description'),
      ];
    case 'delete':
      return [idParam('groupId'), idParam('santaId')];
    default:
      break;
  }
};
