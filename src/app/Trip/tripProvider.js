const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tripDao = require("./tripDao");

// Provider: Read 비즈니스 로직 처리


// 특정 여행 조회
exports.retrieveTrip = async function (tripIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripResult = await tripDao.selectTrip(connection, tripIdx);
    connection.release();

    return tripResult;
}

// 유저 전체 여행 조회
exports.retrieveTrips = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripsResult = await tripDao.selectTrips(connection, userIdx);
    connection.release();

    return tripsResult;
}

// 특정 여행의 발자국 조회
exports.retrieveCourses = async function (tripIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const coursesResult = await tripDao.selectCourses(connection, tripIdx);
    connection.release();

    return coursesResult;
}



// 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.