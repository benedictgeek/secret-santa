const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const _ = require("lodash");
const { sequelize, Sequelize } = require("../models/index");
const jwt = require("jsonwebtoken");
const santaDao = require("../dataaccess/santa_dataaccess");
const memberDao = require("../dataaccess/member_dataaccess");
const santaPairDao = require("../dataaccess/santa_pair_dataaccess");
const mailer = require("../utils/mailer");
module.exports.create = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    body.groupId = req.group.id;
    let members = await memberDao.fetchAll({ groupId: body.groupId });
    //must have at least three members
    if (members.length < 3) {
      statusCode = 403;
      throw "Members list should be atleast three to participate in this event";
    }
    let createdSanta = await santaDao.create({ ...body });
    res.status(200).json(successResponse(createdSanta));
    let newTokenList = [];
    //mail members of new secret santa event with link to view their santa
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
      if (process.env.NODE_ENV == "test") {
        newTokenList = [...newTokenList, token];
        process.env.MEMBER_TOKENS = JSON.stringify(newTokenList);
      }
      let url = `${req.headers.origin}/placeholder/${token}`;
      let groupTitle = req.group.title.toUpperCase();

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
    console.log("ERROR CREATE", error);
    next(createHttpError(statusCode, error));
  }
};

module.exports.sendInvite = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    let members = await memberDao.fetchAll({ groupId: body.groupId });
    members = members.filter((member) => body.emails.includes(member.email));
    res.status(200).json(successResponse("Mails sent"));
    let santaData = await santaDao.findById({ santaId: body.santaId });
    members.forEach((member) => {
      let token = jwt.sign(
        {
          santaId: santaData.id,
          memberId: member.id,
          groupId: body.groupId,
        },
        process.env.SANTA_SECRET,
        { expiresIn: "999years" }
      );
      let url = `${req.headers.origin}/placeholder/${token}`;
      let groupTitle = req.group.title.toUpperCase();

      mailer(member.email, `${groupTitle} Secret Santa`, "santa_invitation", {
        name: member.name,
        groupTitle: groupTitle,
        link: url,
        linkText: "View",
        eventTitle: santaData.title == null ? "" : santaData.title,
        eventDescription:
          santaData.description == null ? "" : santaData.description,
      });
    });
  } catch (error) {
    console.log("SEND INVITE", error);
    next(createHttpError(statusCode, error));
  }
};

module.exports.santaPair = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    let tokenData;
    try {
      tokenData = jwt.verify(body.token, process.env.SANTA_SECRET);
    } catch (error) {
      throw "Token provided invalid";
    }
    console.log("tokenFe", tokenData);
    //get member data and santaEvent from token
    let santaId = tokenData.santaId;
    let memberId = tokenData.memberId;
    let groupId = tokenData.groupId;
    console.log("BEFOREP", santaId);
    let santaPairs = await santaPairDao.fetchAll({ santaId: santaId });
    console.log("SANTP", santaId);
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
    let prospectiveRecipientIds = members.map((member) => member.id);
    if (prospectiveRecipientIds.length == 0) {
      statusCode = 403;
      throw "This group currently have less than three members";
    }
    let recipientId = getUnmatchedRecipientId(
      prospectiveRecipientIds,
      santaPairs,
      memberId
    );
    let createdPair = await santaPairDao.create({
      groupId,
      santaId,
      providerId: memberId,
      recipientId,
    });
    createdPair = await santaPairDao.findWithId({
      santaPairId: createdPair.id,
    });
    console.log(createdPair);
    res.status(200).json(successResponse(createdPair));
    //notify secret santa by mail
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};

let getUnmatchedRecipientId = (
  prospectiveRecipientIds,
  santaPairs,
  memberId
) => {
  //get the pair data if current member was previously a recipient
  let previousPairData = santaPairs.filter(
    (item) => item.recipientId == memberId
  );

  let recipientIds = santaPairs.map((pair) => pair.recipientId);
  recipientIds = [...new Set(recipientIds)];
  //take out the member this current member was previously matched with (provider) from propectiveRecipients
  recipientIds = recipientIds.filter(
    (item) => item.providerId != previousPairData.providerId
  );
  //---->
  //check if everyone else already has a secret santa, so we randomise and someone gets multiple secret santas
  // if (prospectiveRecipientIds.length === recipientIds.length) {
  //   return _.shuffle(recipientIds)[0];
  // }
  //---->

  let unMatchedRecipientIds = prospectiveRecipientIds.filter(
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

module.exports.update = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    delete body.status;
    let updatedSanta = await santaDao.updateOne({ ...body });
    updatedSanta = updatedSanta[1][0];
    res.status(200).json(successResponse(updatedSanta));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.delete = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    delete body.status;
    let updatedSanta = await santaDao.updateOne({ ...body, status: "deleted" });
    updatedSanta = updatedSanta[1][0];
    res.status(200).json(successResponse(updatedSanta));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
