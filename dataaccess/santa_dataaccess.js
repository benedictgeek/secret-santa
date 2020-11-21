const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const SantaEvent = models.SantaEvent;

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await SantaEvent.create(data, {
      transaction: transaction,
      
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    console.log("ERROR CREATE", err)
    throw err.errors;
  }
};

module.exports.findAllForGroup = async (data, transaction = null) => {
  try {
    let result = await SantaEvent.findAll({
      where: {
        groupId: data.groupId,
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw error.errors;
  }
};
