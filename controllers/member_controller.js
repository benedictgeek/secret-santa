const successResponse = require('../utils/successResponse');
const createHttpError = require('http-errors');
const { sequelize, Sequelize } = require('../models/index');
const memberDao = require('../dataaccess/member_dataaccess');
const userDao = require('../dataaccess/user_dataaccess');
module.exports.add = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    //make sure duplicate emails are not registered
    let existingMembersData = await memberDao.fetchAll({
      groupId: req.group.id,
    });
    let existingMemberEmails = existingMembersData.map(
      (member) => member.email
    );
    let filteredProvidedMembersData = body.members.filter(
      (member) => !existingMemberEmails.includes(member.email)
    );
    let groupmembersData = filteredProvidedMembersData.map((member) => {
      return { groupId: req.group.id, email: member.email, name: member.name };
    });
    let createdMembers = await memberDao.bulkCreate(groupmembersData);
    res.status(200).json(successResponse(createdMembers));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.delete = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.params;
    delete body.status;
    let updatedMemberData = await memberDao.updateOne({
      ...body,
      status: 'deleted',
    });
    updatedMemberData = updatedMemberData[1][0];
    res.status(200).json(successResponse('Member deleted successfully'));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};

module.exports.update = async (req, res, next) => {
  let statusCode;
  try {
    let body = req.body;
    delete body.status;
    let updatedMemberData = await memberDao.updateOne({
      ...body,
    });
    updatedMemberData = updatedMemberData[1][0];
    res.status(200).json(successResponse(updatedMemberData));
  } catch (error) {
    next(createHttpError(statusCode, error));
  }
};
