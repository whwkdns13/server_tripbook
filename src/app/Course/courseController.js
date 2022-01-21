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
