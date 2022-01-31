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
    const tripIdx = req.params.tripIdx;

    // validation
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    

    //중단) 사진, 시간, 제목, 코멘트, 위치, 해시태그
    const courseByCourseIdx = await courseProvider.retrieveCourse(courseIdx);

    //최종 반환
    return res.send(response(baseResponse.SUCCESS, courseByCourseIdx));
    
};

//발자국 정보 등록해주는 기능
exports.postCourse = async function (req, res) {

    /**
     * Body: tripIdx, courseImage, courseDate, courseTime, courseTitle, courseComment
     */
    const {tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment} = req.body;
    
    // 빈 값 체크
    if (!tripIdx) return res.send(errResponse(baseResponse.COURSE_TRIPIDX_EMPTY));
    if (!courseDate) return res.send(errResponse(baseResponse.COURSE_COURSEDATE_EMPTY));
    if (!courseTime) return res.send(errResponse(baseResponse.COURSE_COURSETIME_EMPTY));
    if (!courseTitle) return res.send(errResponse(baseResponse.COURSE_COURSETITLE_EMPTY));
    if (!courseImg) return res.send(errResponse(baseResponse.COURSE_COURSEIMAGE_EMPTY));
    if (!courseComment) return res.send(errResponse(baseResponse.COURSE_COURSECOMMENT_EMPTY));
    
    
    // 길이 체크
    if (courseTitle.length > 99)
        return res.send(response(baseResponse.COURSE_COURSETITLE_LENGTH));
        
    if (courseComment.length > 254)
        return res.send(response(baseResponse.COURSE_COURSECOMMENT_LENGTH));

    // createCourse 함수 실행을 통한 결과 값을 postCourseResponse에 저장
    const postCourseResponse = await courseService.createCourse(
        tripIdx, 
        courseImg, 
        courseDate, 
        courseTime, 
        courseTitle, 
        courseComment
    );

    // postCourseResponse 값을 json으로 전달
    return res.send(postCourseResponse);
    
};

//썸네일 사진 업데이트
exports.patchTripImg = async function (req, res) {

    // jwt - tripIdx, path variable :tripIdx, tripImg

    //const userIdFromJWT = req.verifiedToken.userId

    //const userIdx = req.params.userIdx;
    const tripIdx = req.body.tripIdx;
    const tripImg = req.body.tripImg;
    
    // JWT는 이 후 주차에 다룰 내용
    /*
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/
        if (!tripIdx) return res.send(errResponse(baseResponse.TRIPIMG_TRIPIDX_EMPTY));
        if (!tripImg) return res.send(errResponse(baseResponse.TRIPIMG_TRIPIMG_EMPTY));

        const editTripInfo = await courseService.editTripImg(tripIdx, tripImg)
        return res.send(editTripInfo);
    //}
};