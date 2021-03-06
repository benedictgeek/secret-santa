const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const SantaPair = models.SantaPair;

let includeModels = [
  {
    model: models.SantaEvent,
    as: "santa",
  },
  {
    model: models.Member,
    as: "provider",
  },
  {
    model: models.Member,
    as: "recipient",
  },
  {
    model: models.Group,
    as: "group",
  },
];

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await SantaPair.create(data, {
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.findWithId = async (data, transaction = null) => {
  try {
    let result = await SantaPair.findOne({
      where: {
        id: data.santaPairId,
      },
      include: includeModels,
      transaction: transaction,
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
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    console.log("ERROR SHOW", err);
    throw err.errors;
  }
};
