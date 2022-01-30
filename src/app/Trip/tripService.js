const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const tripProvider = require("./tripProvider");
const tripDao = require("./tripDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createTrip = async function (userIdx, tripTitle, departureDate, arrivalDate, themeIdx) {
    try {
        // TODO themeIdx 가 user한테 없을경우 USER_THEMEIDX_NOEXISTS 필요

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertTripInfoParams = [userIdx, tripTitle, departureDate, arrivalDate, themeIdx];

        const connection = await pool.getConnection(async (conn) => conn);

        const tripResult = await tripDao.insertTripInfo(connection, insertTripInfoParams);
        console.log(`tripIdx : ${tripResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createTrip Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
