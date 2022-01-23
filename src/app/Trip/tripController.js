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
 * [GET] /app/trips/:tripIdx
 */
exports.getTrip = async function (req, res) {
    /**
     * Path Variable: tripIdx
     */

    const tripIdx = req.params.tripIdx;
    // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));

    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    return res.send(response(baseResponse.SUCCESS, tripBytripIdx));
}

/**
 * API No. 1-2
 * API Name : (특정 유저) 전체 여행 조회 API
 * [GET] /app/trips
 */
exports.getTrips = async function (req, res){
    /**
     * 
     */

    return res.send(response(baseResponse.SUCCESS));
}