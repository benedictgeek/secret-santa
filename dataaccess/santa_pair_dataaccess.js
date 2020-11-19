const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const SantaPair = models.SantaPair;

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await SantaPair.create(data, {
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
        santaId: data.santaId,
      },
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};
