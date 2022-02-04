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

//발자국 삭제 api
exports.deleteCourse = async function (req, res) {

    //req : courseIdx
    const courseIdx = req.params.courseIdx;

    // validation
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));

    const eraseCourseInfo = await courseService.eraseCourse(courseIdx);

    //최종 반환
    return res.send(eraseCourseInfo);
    
};