const jwtMiddleware = require("../../../config/jwtMiddleware");
//const userProvider = require("../../app/User/userProvider");
//const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS));
}
