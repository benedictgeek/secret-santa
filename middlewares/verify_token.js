const jwt = require("jsonwebtoken");

const createHttpError = require("http-errors");

module.exports.verifyToken = (req, res, next) => {
  let statusCode = 401;
  try {
    let token;
    try {
      token = req.headers.authorization.split(" ")[1];
    } catch (error) {
      throw "Please provide token in headers as 'Authoriztion Bearer __token__'";
    }
    let user;
    try {
      user = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      throw "Unauthorized";
    }
    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
