const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const Member = models.Member;

module.exports.bulkCreate = async (data, transaction = null) => {
  try {
    let result = await Member.bulkCreate(data, {
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.fetchAll = async (data, transaction = null) => {
  try {
    let result = await SantaPair.findAll({
      where: {
        groupId: data.groupId,
      },
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};
