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
    //mail members of new group they are just added to
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
