const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const User = models.User;

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await User.create(data, {
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.findWithEmail = async (data, transaction = null) => {
  try {
    let result = await User.findOne({
      where: {
        email: data.email,
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw err.errors;
  }
};

module.exports.updateOne = async (data, transaction = null) => {
  try {
    let result = await User.update(data, {
      where: {
        email: data.email,
      },
      transaction: transaction,
      // plain: true,
      returning: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw err.errors;
  }
};
