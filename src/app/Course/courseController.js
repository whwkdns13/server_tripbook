const jwtMiddleware = require("../../../config/jwtMiddleware");
const courseProvider = require("../../app/Course/courseProvider");
const courseService = require("../../app/Course/courseService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS));
}

//하나의 발자국 상세 정보를 courseIdx로 가져오기
exports.getCourseByIdx = async function (req, res) {

    //req : courseIdx
    const courseIdx = req.params.courseIdx;

    // validation
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));

    //중단) 사진, 시간, 제목, 코멘트, 위치, 해시태그
    const courseByCourseIdx = await courseProvider.retrieveCourse(courseIdx);

    //최종 반환
    return res.send(response(baseResponse.SUCCESS, courseByCourseIdx));
    
};


//date patch 함수
exports.patchCourseDate = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseDate = req.body.courseDate;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseDate) return res.send(errResponse(baseResponse.COURSE_COURSEDATE_EMPTY));
    
    const editCourseDateInfo = await courseService.editCourseDate(courseIdx, courseDate);
    
    return res.send(editCourseDateInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//time patch 함수
exports.patchCourseTime = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseTime = req.body.courseTime;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseTime) return res.send(errResponse(baseResponse.COURSE_COURSETIME_EMPTY));
    
    const editCourseTimeInfo = await courseService.editCourseTime(courseIdx, courseTime);
    
    return res.send(editCourseTimeInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//title patch 함수
exports.patchCourseTitle = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseTitle = req.body.courseTitle;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseTitle) return res.send(errResponse(baseResponse.COURSE_COURSETITLE_EMPTY));
    
    const editCourseTitleInfo = await courseService.editCourseTitle(courseIdx, courseTitle);
    
    return res.send(editCourseTitleInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//img patch 함수
exports.patchCourseImg = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseImg = req.body.courseImg;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseImg) return res.send(errResponse(baseResponse.COURSE_COURSEIMG_EMPTY));
    
    const editCourseImgInfo = await courseService.editCourseImg(courseIdx, courseImg);
    
    return res.send(editCourseImgInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//comment patch 함수
exports.patchCourseComment = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseComment = req.body.courseComment;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseComment) return res.send(errResponse(baseResponse.COURSE_COURSECOMMENT_EMPTY));
    
    const editCourseCommentInfo = await courseService.editCourseComment(courseIdx, courseComment);
    
    return res.send(editCourseCommentInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//cardIdx patch 함수
exports.patchCardIdx = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const cardIdx = req.body.cardIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!cardIdx) return res.send(errResponse(baseResponse.COURSE_CARDIDX_EMPTY));
    
    const editCardIdxInfo = await courseService.editCardIdx(courseIdx, cardIdx);
    
    return res.send(editCardIdxInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

    //}
};

//tripidx변경은 사용자가 하는 것은 옳지 않음
        /*
        
        //cardIdx 변경은 순서변경
        if (cardIdx) {
            editCardIdxInfo = await courseService.editCardIdx(courseIdx, cardIdx);
        }

        
        */