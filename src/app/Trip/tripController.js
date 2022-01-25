const jwtMiddleware = require("../../../config/jwtMiddleware");
const tripProvider = require("../Trip/tripProvider");
const tripService = require("../Trip/tripService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test/trip
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1-1
 * API Name : 특정 TRIP 조회 API
 * [GET] /app/trip/:tripIdx
 */
exports.getTrip = async function (req, res) {
    /**
     * Path Variable: tripIdx
     */

    const tripIdx = req.params.tripIdx;
    // errResponse 전달
    // TODO Path Variable이 params인데 errResponse가 필요한가?
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));

    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    return res.send(response(baseResponse.SUCCESS, tripBytripIdx));
}

/**
 * API No. 1-2
 * API Name : 유저 전체 여행 조회 API
 * [GET] /app/trips/:userIdx
 */
exports.getTrips = async function (req, res) {
    /**
     * Path Variable: userIdx
     */

    const userIdx = req.params.userIdx;
    // errResponse 전달
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    //TODO baseResponse 수정 필요
    //     -> USER_USERIDX_EMPTY
    //TODO userIdx에 여행이 있는지 없는지 확인 필요 
    //     -> tripProvider or tripController 에서 구현 필요

    const tripsByuserIdx = await tripProvider.retrieveTrips(userIdx);
    return res.send(response(baseResponse.SUCCESS, tripsByuserIdx));
}

/**
 * API No. 1-3
 * API Name : 특정 여행의 발자국 조회 API
 * [GET] /app/trips/:tripIdx/courses
 */
exports.getTripCourses = async function (req, res) {
    /**
     * Path Variable: tripIdx
     */

    const tripIdx = req.params.tripIdx;
    // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));

    const coursesBytripIdx = await tripProvider.retrieveCourses(tripIdx);
    return res.send(response(baseResponse.SUCCESS, coursesBytripIdx));
}