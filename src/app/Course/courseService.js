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

//Course 변수들을 받아서 course를 등록해주는 기능
exports.createCourse = async function (tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment, cardIdx) {
    try {
        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertCourseInfoParams = [tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment, cardIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const courseIdxResult = await courseDao.insertCourseInfo(connection, insertCourseInfoParams);
        
        //콘솔에 추가된 코스 idx를 출력하고 나옴
        console.log(`추가된 코스idx : ${courseIdxResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createCourse Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//courseDate변경 함수
exports.editCourseDate = async function (courseIdx, courseDate) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCourseDateResult = await courseDao.updateCourseDate(connection, courseIdx, courseDate)
        connection.release();
        
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCourseDate Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
//courseTime변경 함수
exports.editCourseTime = async function (courseIdx, courseTime) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCourseTimeResult = await courseDao.updateCourseTime(connection, courseIdx, courseTime)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCourseTime Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
//courseTitle변경 함수
exports.editCourseTitle = async function (courseIdx, courseTitle) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCourseTitleResult = await courseDao.updateCourseTitle(connection, courseIdx, courseTitle)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCourseTitle Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
//courseImg변경 함수
exports.editCourseImg = async function (courseIdx, courseImg) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCourseImgResult = await courseDao.updateCourseImg(connection, courseIdx, courseImg)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCourseImg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
//courseComment변경 함수
exports.editCourseComment = async function (courseIdx, courseComment) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCourseCommentResult = await courseDao.updateCourseComment(connection, courseIdx, courseComment)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCourseComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
//cardIdx변경 함수
exports.editCardIdx = async function (courseIdx, cardIdx) {
    try {
        console.log(courseIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editCardIdxResult = await courseDao.updateCardIdx(connection, courseIdx, cardIdx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editCardIdx Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//courseHashTag추가기능
exports.createCourseHashTag = async function (courseIdx, hashTagIdx) {
    try {
        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertCourseHashTagInfoParams = [courseIdx, hashTagIdx];

        const connection = await pool.getConnection(async (conn) => conn);

        const courseHashTagIdxResult = await courseDao.insertCourseHashTagInfo(connection, insertCourseHashTagInfoParams);
        console.log(`코스에 추가된 해쉬태그 : ${courseHashTagIdxResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);
        
    } catch (err) {
        logger.error(`App - createCourseHashTag Service error\n: ${err.message}`);
    }
};

//tripImg(썸네일 사진) update해주는 함수
exports.editTripImg = async function (tripIdx, tripImg) {
    try {
        console.log(tripIdx);
        const updateTripImgParams = [tripImg, tripIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const editTripImgResult = await courseDao.updateTripImg(connection,updateTripImgParams);
        
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editTripImg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

