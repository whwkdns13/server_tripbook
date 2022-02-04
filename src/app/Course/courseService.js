const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const courseProvider = require("./courseProvider");
const courseDao = require("./courseDao");



const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createCourse = async function (title, date, time, image, comment) {
    try {
        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertCourseInfoParams = [title, date, time, image, comment];

        const connection = await pool.getConnection(async (conn) => conn);

        const courseIdxResult = await courseDao.insertCourseInfo(connection, insertCourseInfoParams);
        console.log(`추가된 회원 : ${courseIdxResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);
        
    } catch (err) {
        logger.error(`App - createCourse Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.eraseCourse = async function (courseIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const deleteCourseResult = await courseDao.changeCourseStatusDelete(connection, courseIdx);
        connection.release();
        return response(baseResponse.SUCCESS);
        
    } catch (err) {
        logger.error(`App - createCourse Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};