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


//patch함수는 어디서든 쓰일 수 있도록 넘어온 항목이 존재하면 각각 service를 실행시켜준다.
exports.patchCourseDate = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdxFromJWT = req.verifiedToken.userIdx;

    const {userIdx, courseIdx} = req.params;
    const courseDate = req.body.courseDate;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseDate) return res.send(errResponse(baseResponse.COURSE_COURSEDATE_EMPTY));
    
    const editCourseDateInfo = courseService.editCourseDate(courseIdx, courseDate);
    
    return res.send(editCourseDateInfo);
    // JWT는 이 후 주차에 다룰 내용
    /*if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {*/

        //const editCourseDateInfo, editCourseTimeInfo, editCourseTitleInfo, editCourseImgInfo, editCourseCommentInfo, editCardIdxInfo
        //tripidx변경은 사용자가 하는 것은 옳지 않음
        /*
        if (courseTime) {
            editCourseTimeInfo = courseService.editCourseTime(courseIdx, courseTime);
        }
        if (courseTitle) {
            editCourseTitleInfo = courseService.editCourseTitle(courseIdx, courseTitle);
        }
        if (courseImg) {
            editCourseImgInfo = courseService.editCourseImg(courseIdx, courseImg);
        }
        if (courseComment) {
            editCourseCommentInfo = courseService.editCourseComment(courseIdx, courseComment);
        }
        //cardIdx 변경은 순서변경
        if (cardIdx) {
            editCardIdxInfo = courseService.editCardIdx(courseIdx, cardIdx);
        }

        
        */
    //}
};
