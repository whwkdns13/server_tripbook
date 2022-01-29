const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const courseDao = require("./courseDao");

// Provider: Read 비즈니스 로직 처리
// courseIdx로 course전체 정보 받아오는 함수
exports.retrieveCourse = async function (courseIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const courseResult = await courseDao.selectCourseIdx(connection, courseIdx);
  
    connection.release();

    return courseResult[0];
  };
