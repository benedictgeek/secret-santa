const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../dataaccess/user_dataaccess");
const mailer = require("../utils/mailer");

module.exports.login = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    let user = await userDao.findWithEmail({ email: body.email });
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
    res.status(200).json(successResponse({ user, token }));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.checkEmail = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    let user = await userDao.findWithEmail({ email: body.email });
    if (user == null) {
      statusCode = 404;
      throw "User with this email not found";
    }
    res.status(200).json(successResponse(user));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.getPasswordResetLink = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    let userData = await userDao.findWithEmail({ email: body.email });
    if (userData == null) {
      statusCode = 404;
      throw "User not found";
    }
    let passwordResetToken = jwt.sign(
      userData,
      process.env.PASSWORD_RESET_SECRET,
      {
        expiresIn: "24hr",
      }
    );
    delete userData.password;
    res.status(200).json(
      successResponse({
        ...userData,
        passwordResetToken:
          process.env.NODE_ENV == "test" ? passwordResetToken : null,
      })
    );

    mailer(userData.email, "Secret Santa Reset password", "reset_password", {
      name: userData.name,
      link: `${req.headers.origin}/reset-password/${passwordResetToken}`,
      linkText: "Reset",
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};

module.exports.resetPassword = async (req, res, next) => {
  let statusCode;
  try {
    let userData;
    let body = req.body;
    try {
      userData = jwt.verify(body.resetToken, process.env.PASSWORD_RESET_SECRET);
    } catch (error) {
      statusCode = 422;
      throw "Provided token invalid";
    }
    let hashedPassword = await bcrypt.hash(body.password, 12);
    let updatedUserData = await userDao.updateOne({
      email: userData.email,
      password: hashedPassword,
    });
    updatedUserData = updatedUserData[1][0];
    delete updatedUserData.password;
    res.status(200).json(successResponse(updatedUserData));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.update = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    delete body.password;
    let updatedUserData = await userDao.updateOne({
      ...body,
    });
    updatedUserData = updatedUserData[1][0];
    delete updatedUserData.password;
    res.status(200).json(successResponse(updatedUserData));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
