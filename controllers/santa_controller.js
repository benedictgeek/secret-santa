const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const _ = require("lodash");
const { sequelize, Sequelize } = require("../models/index");
const santaDao = require("../dataaccess/santa_dataaccess");
const memberDao = require("../dataaccess/member_dataaccess");
const santaPairDao = require("../dataaccess/santa_pair_dataaccess");
module.exports.create = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    body.groupId = req.group.id;
    let createdSanta = await santaDao.create({ ...body });
    res.status(200).json(successResponse(createdSanta));
    //mail members of new secret santa event with link to view their santa
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.santaPair = async (req, res, next) => {
  let statusCode;
  try {
    //get member data and santaEvent from token
    let santaId;
    let memberId;
    let groupId;
    let santaPairs = await santaPairDao.fetchAll({ santaId: santaId });
    let secretSantaData = santaPairs.filter(
      (pair) => pair.providerId === memberId
    );
    if (secretSantaData.length != 0) {
      statusCode = 409;
      throw "You are already a secret santa for this santa!";
    }
    let members = await memberDao.fetchAll({ groupId: groupId });
    let recipientId = getUnmatchedRecipientId(members, santaPairs);
    let createdPair = await santaPairDao.create({
      groupId,
      santaId,
      providerId: memberId,
      recipientId,
    });
    res.status(200).json(successResponse(createdPair));
    //notify secret santa by mail
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

let getUnmatchedRecipientId = (members, santaPairs) => {
  let recipientIds = santaPairs.map((pair) => pair.recipientId);
  let member = _.shuffle(members)[0];
  if (recipientIds.includes(member.id))
    getUnmatchedRecipientId(members, santaPairs);
  return member.id;
};
