const createHttpError = require("http-errors");
const groupDao = require("../dataaccess/group_dataaccess");
module.exports.checkAdmin = async (req, res, next) => {
  let statusCode;
  try {
    console.log(req.body);
    console.log(req.params);
    let body = { ...req.body, ...req.params };
    let group = await groupDao.findWithId({ groupId: body.groupId });
    if (group == null) {
      statusCode = 404;
      throw "This group ddes not exist";
    }
    req.group = group;
    if (group.userId !== req.user.id) {
      statusCode = 403;
      throw "You are not authorized to perform this operation";
    }
    next();
  } catch (error) {
    console.log(error);
    next(createHttpError(statusCode, error));
  }
};
