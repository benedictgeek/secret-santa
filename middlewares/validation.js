const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");

module.exports.handleValidation = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createHttpError(422, errors.array({ onlyFirstError: true })));
  }
  next();
};
