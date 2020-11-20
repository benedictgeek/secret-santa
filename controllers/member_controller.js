const successResponse = require("../utils/successResponse");
const createHttpError = require("http-errors");
const { sequelize, Sequelize } = require("../models/index");
const memberDao = require("../dataaccess/member_dataaccess");
const userDao = require("../dataaccess/user_dataaccess");
module.exports.add = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    let groupmembersData = body.members.map((member) => {
      return { groupId: req.group.id, email: member.email, name: member.name };
    });
    let createdMembers = await memberDao.bulkCreate(groupmembersData);
    res.status(200).json(successResponse(createdMembers));
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};

module.exports.delete = async (req, res, next) => {
  let statusCode;
  try {
    console.log("IN HERE!!!");
    let body = req.params;
    let deleteMember = await memberDao.delete({
      email: body.email,
      groupId: body.groupId,
    });
    res.status(200).json(successResponse("Member deleted successfully"));
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};

module.exports.update = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    let updatedMemberData = await memberDao.updateOne({
      ...body,
    });
    updatedMemberData = updatedMemberData[1][0];
    res.status(200).json(successResponse(updatedMemberData));
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};
