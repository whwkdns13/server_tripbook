const jwtMiddleware = require("../../../config/jwtMiddleware");
const courseProvider = require("../../app/Course/courseProvider");
const courseService = require("../../app/Course/courseService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
//const tripProvider = require("./tripProvider");

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
    //if (!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));
    
    //상단) 바 trip정보 가져오기
    //const tripByTripIdx = await tripProvider.retrieveTrip(tripIdx);

    //중단) 사진, 시간, 제목, 코멘트, 위치, 해시태그
    const courseByCourseIdx = await courseProvider.retrieveCourse(courseIdx);

    //최종 반환
    //const courseInfo = [tripByTripIdx, courseByCourseIdx];
    return res.send(response(baseResponse.SUCCESS, courseByCourseIdx));


    /*
    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
    */
    
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
    
    //코멘트, 이미지는 비어도 됨
    //if (!courseImg) return res.send(errResponse(baseResponse.COURSE_COURSEIMAGE_EMPTY));
    //if (!courseComment) return res.send(errResponse(baseResponse.COURSE_COURSECOMMENT_EMPTY));

    // 길이 체크
    if (courseTitle.length > 99)
        return res.send(response(baseResponse.COURSE_COURSETITLE_LENGTH));
        
    if (courseComment.length > 254)
        return res.send(response(baseResponse.COURSE_COURSECOMMENT_LENGTH));

    // createUser 함수 실행을 통한 결과 값을 signUpResponse에 저장
    const postCourseResponse = await courseService.createCourse(
        tripIdx, 
        courseImg, 
        courseDate, 
        courseTime, 
        courseTitle, 
        courseComment
    );

    // signUpResponse 값을 json으로 전달
    return res.send(postCourseResponse);
};