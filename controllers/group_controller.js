const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const { sequelize, Sequelize } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const groupDao = require("../dataaccess/group_dataaccess");
const userDao = require("../dataaccess/user_dataaccess");
const mailer = require("../utils/mailer");
module.exports.create = async (req, res, next) => {
  let statusCode;
  let transaction = await sequelize.transaction({
    deferrable: Sequelize.Deferrable.SET_DEFERRED,
  });
  try {
    let body = req.body;
    let isNewUser = false;
    let group = await groupDao.findWithTitle(
      { title: body.title },
      transaction
    );
    if (group != null) {
      statusCode = 409;
      throw "This group already exists";
    }

    let user = await userDao.findWithEmail({ email: body.email }, transaction);
    if (user == null) {
      if (body.password == null || body.name == null) {
        statusCode = 422;
        throw "Please provide name and password to create an account";
      }
      body.password = await bcrypt.hash(body.password, 12);
      user = await userDao.create({ ...body }, transaction);
      isNewUser = true;
    }
    group = await groupDao.create({ ...body, userId: user.id }, transaction);
    let token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "24hr" });
    delete user.password;
    transaction.commit();
    res.status(200).json(successResponse({ group, user, token }));
    isNewUser &&
      mailer(user.email, "Account creation", "new_account", {
        name: user.name,
        linkText: "View",
      });
    mailer(user.email, "Group creation", "group_creation", {
      name: user.name,
      groupName: group.title.toUpperCase(),
      linkText: "View",
    });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    next(createHttpError(statusCode, error));
  }
};

module.exports.getUserGroups = async (req, res, next) => {
  let statusCode;
  try {
    let userGroups = await groupDao.findAllForUser({ userId: req.user.id });
    res.status(200).json(successResponse(userGroups));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
