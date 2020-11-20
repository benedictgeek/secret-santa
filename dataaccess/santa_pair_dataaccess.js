const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const SantaPair = models.SantaPair;

let includeModels = [
  {
    model: models.SantaEvent,
    as: "santaEvent",
  },
  {
    model: models.Member,
    as: "provider",
  },
  {
    model: models.Member,
    as: "recipient",
  },
];

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await SantaPair.create(data, {
      include: includeModels,
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.findWithProvider = async (data, transaction = null) => {
  try {
    let result = await SantaPair.findOne({
      where: {
        santaId: data.santaId,
        providerId: data.providerId,
      },
      include: includeModels,
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
