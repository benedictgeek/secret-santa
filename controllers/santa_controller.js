const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const _ = require("lodash");
const { sequelize, Sequelize } = require("../models/index");
const jwt = require("jsonwebtoken");
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
    let members = await memberDao.fetchAll({ groupId: body.groupId });
    members.forEach((member) => {
      let token = jwt.sign(
        {
          santaId: createdSanta.id,
          memberId: member.id,
          groupId: body.groupId,
        },
        process.env.SANTA_SECRET,
        { expiresIn: "999years" }
      );

      let url = `${req.origin}/placeholder/${token}`;
      let groupTitle = group.title.toUpperCase();
      mailer(member.email, `${groupTitle} Secret Santa`, "santa_invitation", {
        name: member.name,
        groupTitle: groupTitle,
        link: url,
        linkText: "View",
        eventTitle: createdSanta.title == null ? "" : createdSanta.title,
        eventDescription:
          createdSanta.description == null ? "" : createdSanta.description,
      });
    });
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
      let pairData = await santaPairDao.findWithProvider({
        santaId: santaId,
        providerId: memberId,
      });
      return res.status(200).json(successResponse(pairData));
    }
    let members = await memberDao.fetchAll({ groupId: groupId });
    //remove provider from members so you dont become a secret santa to yourself
    members = members.filter((member) => member.id != memberId);
    memberIds = members.map((member) => member.id);
    let recipientId = getUnmatchedRecipientId(memberIds, santaPairs);
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

let getUnmatchedRecipientId = (memberIds, santaPairs) => {
  let recipientIds = santaPairs.map((pair) => pair.recipientId);
  recipientIds = [...new Set(recipientIds)];
  //check if everyone already has a secret santa, so we randomise and someone gets multiple secret santas
  if (memberIds.length === recipientIds.length) {
    return _.shuffle(recipientIds)[0];
  }

  let unMatchedRecipientIds = memberIds.filter(
    (memberId) => !recipientIds.includes(memberId)
  );

  let unMatchedRecipientId = _.shuffle(unMatchedRecipientIds)[0];

  return unMatchedRecipientId;
};

module.exports.fetchAll = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    let groupSanta = await santaDao.findAllForGroup({ groupId: body.groupId });
    res.status(200).json(successResponse(groupSanta));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
