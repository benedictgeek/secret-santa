const models = require("../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;
const Group = models.Group;

module.exports.create = async (data, transaction = null) => {
  try {
    let result = await Group.create(data, {
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err.errors;
  }
};

module.exports.findWithId = async (data, transaction = null) => {
  try {
    let result = await Group.findOne({
      where: {
        id: data.groupId,
        status: "active",
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw error.errors;
  }
};

module.exports.findWithTitle = async (data, transaction = null) => {
  try {
    let result = await Group.findOne({
      where: {
        title: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("title")),
          "=",
          `${data.title.toLowerCase()}`
        ),
        status: "active",
      },
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw error.errors;
  }
};

module.exports.findAllForUser = async (data, transaction = null) => {
  try {
    let result = await Group.findAll({
      where: {
        userId: data.userId,
        status: "active",
      },
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("members.id")), "membersCount"],
        ],
      },
      include: [
        {
          model: models.Member,
          as: "members",
          where: { status: "active" },
          required: false,
          attributes: [],
        },
      ],
      group: ["Group.id"],
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw error.errors;
  }
};

module.exports.findOne = async (data, transaction = null) => {
  try {
    let result = await Group.findOne({
      where: {
        id: data.groupId,
        status: "active",
      },
      include: [
        {
          model: models.Member,
          as: "members",
          where: { status: "active" },
          required: false,
        },
      ],
      transaction: transaction,
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log(error);
    throw error.errors;
  }
};

module.exports.updateOne = async (data, transaction = null) => {
  try {
    let result = await Group.update(data, {
      where: {
        id: data.groupId,
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
