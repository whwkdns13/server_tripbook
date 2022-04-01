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
        console.log(`tripIdx : ${tripResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS, tripResult[0].insertId);

    } catch (err) {
        logger.error(`App - createTrip Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// tripTitle 변경
exports.editTripTitle = async function (tripIdx, tripTitle) {
    try {
        const editTripTitleParams = [tripTitle, tripIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const editTripTitleResult = await tripDao.updateTripTitle(connection, editTripTitleParams);
        connection.release();

        return response(baseResponse.SUCCESS, editTripTitleResult);

    } catch (err) {
        logger.error(`App - editTripTitle Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// departureDate 변경
exports.editDepartureDate = async function (tripIdx, departureDate) {
    try {
        const editDepartureDateParams = [departureDate, tripIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const editDepartureDateResult = await tripDao.updateDepartureDate(connection, editDepartureDateParams);
        connection.release();

        return response(baseResponse.SUCCESS, editDepartureDateResult);

    } catch (err) {
        logger.error(`App - editDepartureDate Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// arrivalDate 변경
exports.editArrivalDate = async function (tripIdx, arrivalDate) {
    try {
        const editArrivalDateParams = [arrivalDate, tripIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const editArrivalDateResult = await tripDao.updateArrivalDate(connection, editArrivalDateParams);
        connection.release();

        return response(baseResponse.SUCCESS, editArrivalDateResult);

    } catch (err) {
        logger.error(`App - editArrivalDate Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// Theme 변경
exports.editTripTheme = async function (tripIdx, themeIdx) {
    try {
        const editTripThemeParams = [themeIdx, tripIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const editTripThemeResult = await tripDao.updateTripTheme(connection, editTripThemeParams);
        connection.release();

        return response(baseResponse.SUCCESS, editTripThemeResult);

    } catch (err) {
        logger.error(`App - editTripTheme Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// trip 변경
exports.editTrip = async function (tripIdx, tripTitle, departureDate, arrivalDate, themeIdx) {
    try {
        const editTripParams = [tripTitle, themeIdx, departureDate, arrivalDate, tripIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const editTripResult = await tripDao.updateTrip(connection, editTripParams);
        connection.release();

        return response(baseResponse.SUCCESS, editTripResult);

    } catch (err) {
        logger.error(`App - editTrip Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};