const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tripDao = require("./tripDao");

// Provider: Read 비즈니스 로직 처리

// 최근 여행 인덱스 조회
exports.retrieveLatest = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripIdxResult = await tripDao.selectLatestTrip(connection, userIdx);
    connection.release();

    return tripIdxResult;
}

// 전체 여행 수 조회
exports.retrieveTripsCount = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const countResult = await tripDao.selectTripsCount(connection, userIdx);
    connection.release();

    return countResult;
}

// 특정 여행 조회
exports.retrieveTrip = async function (tripIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripResult = await tripDao.selectTrip(connection, tripIdx);
    connection.release();

    return tripResult;
}

// 특정 여행 발자국 조회
exports.retrieveCourses = async function (tripIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const coursesResult = await tripDao.selectCourses(connection, tripIdx);
    connection.release();

    return coursesResult;
}

// 유저 전체 여행 조회
exports.retrieveTrips = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripsResult = await tripDao.selectTrips(connection, userIdx);
    connection.release();

    return tripsResult;
}

// 유저 전체 여행 조회
exports.retrieveHistorys = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const historysResult = await tripDao.selectHistorys(connection, userIdx);
    connection.release();

    return historysResult;
}

// 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.