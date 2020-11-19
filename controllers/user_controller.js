const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../dataaccess/user_dataaccess");

module.exports.login = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    let user = userDao.findWithEmail({ email: body.email });
    if (user == null) {
      statusCode = 401;
      throw "Unauthorized";
    }
    let passwordMatched = await bcrypt.compare(body.password, user.password);
    if (!passwordMatched) {
      statusCode = 401;
      throw "Unauthorized";
    }
    let token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "24hr" });
    res.status(200).json(successResponse(token));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
