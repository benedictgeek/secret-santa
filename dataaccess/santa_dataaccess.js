const models = require("../models/index");
const sequelize = models.sequelize;
const Op = models.Sequelize.Op;
const SantaEvent = models.SantaEvent;

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await SantaEvent.create(data, {
      include: [
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
      ],
      transaction: transaction,
      plain: true,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};
