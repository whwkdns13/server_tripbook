const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const courseDao = require("./courseDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveCourse = async function (courseIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const courseResult = await courseDao.selectCourseIdx(connection, courseIdx);
  
    connection.release();

    return courseResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
  };