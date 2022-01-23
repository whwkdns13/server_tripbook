const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tripDao = require("./tripDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveTrip = async function (tripIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    const tripResult = await tripDao.selectTrip(connection, tripIdx);
    connection.release();

    return tripResult;
}




// 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.