const { body, param } = require("express-validator");
module.exports.idBody = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isUUID(4)
    .withMessage(`${field} expected be to a uuid4`);
module.exports.idParam = (field) =>
  param(field)
    .notEmpty()
    .withMessage(
      `Please attach the ${field} at the right position in the query string`
    )
    .isUUID(4)
    .withMessage(`${field} expected be to a uuid4`);
module.exports.stringParam = (field) =>
  param(field)
    .notEmpty()
    .withMessage(
      `Please attach the ${field} at the right position in the query string`
    )
    .isString()
    .trim()
    // .isAlphanumeric()
    .withMessage(`${field} can only contain alphanumeric characters`)
    .customSanitizer((string) => string.replace(/\s+/g, " "));
module.exports.stringBodyAlphNumRequired = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isAlphanumeric()
    .trim()
    .withMessage(`${field} can only contain alphanumeric characters`);

module.exports.stringBodyAlphNumNotRequired = (field) =>
  body(field)
    .optional({ nullable: true })
    .isAlphanumeric()
    .trim()
    .withMessage(`${field} can only contain alphanumeric characters`);

module.exports.stringBodyRequired = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isString()
    .trim()
    .withMessage(`${field} please provide a string`)
    .customSanitizer((string) => string.replace(/\s+/g, " "));

module.exports.stringBodyNotRequired = (field) =>
  body(field)
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage(`${field} please provide a string`)
    .customSanitizer((string) => string.replace(/\s+/g, " "));

module.exports.emailValidator = (feild) =>
  body(feild)
    .notEmpty()
    .withMessage(`Email is required`)
    .isEmail()
    .withMessage(`Email  invalid`)
    .normalizeEmail();

module.exports.emailValidatorParam = param("email")
  .notEmpty()
  .withMessage(
    "Please attach the email at the right position in the query string"
  )
  .isEmail()
  .withMessage("Email invalid")
  .normalizeEmail();
module.exports.passwordValidator = body("password")
  // .optional({ nullable: true })
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be atleast 8 characters");

module.exports.passwordValidatorNotRequired = body("password")
  .optional({ nullable: true })
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be atleast 8 characters");
