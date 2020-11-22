const models = require('../models/index');
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const Member = models.Member;

module.exports.bulkCreate = async (data, transaction = null) => {
  try {
    let result = await Member.bulkCreate(data, {
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.fetchAll = async (data, transaction = null) => {
  try {
    let result = await Member.findAll({
      where: {
        groupId: data.groupId,
        status: 'active',
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.delete = async (data, transaction = null) => {
  try {
    let result = await Member.destroy({
      where: {
        email: data.email,
        groupId: data.groupId,
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.updateOne = async (data, transaction = null) => {
  try {
    let result = await Member.update(data, {
      where: {
        email: data.email,
        groupId: data.groupId,
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
