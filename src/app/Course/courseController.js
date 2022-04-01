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

    // JWT 검증
    const userIdx = req.params.userIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    // validation
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    

    //중단) 사진, 시간, 제목, 코멘트, 위치, 해시태그
    const courseByCourseIdx = await courseProvider.retrieveCourse(courseIdx);
    if(!courseByCourseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_NOT_EXIST));
    const tagByCourseIdx = await courseProvider.retrieveCourseTag(courseIdx);
    const courseInfo = [courseByCourseIdx, tagByCourseIdx];
    //최종 반환
    return res.send(response(baseResponse.SUCCESS, courseInfo));
    
};

//발자국 정보 등록해주는 기능
exports.postCourse = async function (req, res) {
    /**
     * Body: tripIdx, courseImage, courseDate, courseTime, courseTitle, courseComment
     */
    const {tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment, cardIdx, latitude, longitude} = req.body;
    
    // JWT 검증
    const userIdx = req.params.userIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    // 빈 값 체크
    if (!tripIdx) return res.send(errResponse(baseResponse.COURSE_TRIPIDX_EMPTY));
    if (!courseDate) return res.send(errResponse(baseResponse.COURSE_COURSEDATE_EMPTY));
    if (!courseTime) return res.send(errResponse(baseResponse.COURSE_COURSETIME_EMPTY));
    if (!courseTitle) return res.send(errResponse(baseResponse.COURSE_COURSETITLE_EMPTY));
    if (!courseImg) return res.send(errResponse(baseResponse.COURSE_COURSEIMAGE_EMPTY));
    if (!courseComment) return res.send(errResponse(baseResponse.COURSE_COURSECOMMENT_EMPTY));
    if (!cardIdx) return res.send(errResponse(baseResponse.COURSE_CARDIDX_EMPTY));
    //if (!latitude) return res.send(errResponse(baseResponse.COURSE_CARDIDX_EMPTY));
    //if (!longitude) return res.send(errResponse(baseResponse.COURSE_CARDIDX_EMPTY));

    // 길이 체크
    if (courseTitle.length > 99)
        return res.send(response(baseResponse.COURSE_COURSETITLE_LENGTH));
        
    if (courseComment.length > 254)
        return res.send(response(baseResponse.COURSE_COURSECOMMENT_LENGTH));

    // createCourse 함수 실행을 통한 결과 값을 postCourseResponse에 저장
    const postCourseResponse = await courseService.createCourse(
        tripIdx, 
        cardIdx,
        courseImg, 
        courseDate, 
        courseTime, 
        courseTitle, 
        courseComment,
        latitude,
        longitude
    );

    // postCourseResponse 값을 json으로 전달
    return res.send(postCourseResponse);
    
};

//date patch 함수
exports.patchCourseDate = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const courseDate = req.body.courseDate;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseDate) return res.send(errResponse(baseResponse.COURSE_COURSEDATE_EMPTY));
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }    
    
    const editCourseDateInfo = await courseService.editCourseDate(courseIdx, courseDate);
    
    return res.send(editCourseDateInfo);
};

//time patch 함수
exports.patchCourseTime = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const courseTime = req.body.courseTime;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseTime) return res.send(errResponse(baseResponse.COURSE_COURSETIME_EMPTY));
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    
    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    const editCourseTimeInfo = await courseService.editCourseTime(courseIdx, courseTime);
    
    return res.send(editCourseTimeInfo);
    
};

//title patch 함수
exports.patchCourseTitle = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const courseTitle = req.body.courseTitle;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseTitle) return res.send(errResponse(baseResponse.COURSE_COURSETITLE_EMPTY));
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    
    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }


    const editCourseTitleInfo = await courseService.editCourseTitle(courseIdx, courseTitle);
    
    return res.send(editCourseTitleInfo);
    
};

//img patch 함수
exports.patchCourseImg = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const courseImg = req.body.courseImg;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseImg) return res.send(errResponse(baseResponse.COURSE_COURSEIMG_EMPTY));
    
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }


    const editCourseImgInfo = await courseService.editCourseImg(courseIdx, courseImg);
    
    return res.send(editCourseImgInfo);
};

//comment patch 함수
exports.patchCourseComment = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const courseComment = req.body.courseComment;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!courseComment) return res.send(errResponse(baseResponse.COURSE_COURSECOMMENT_EMPTY));
    
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    
    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    const editCourseCommentInfo = await courseService.editCourseComment(courseIdx, courseComment);
    
    return res.send(editCourseCommentInfo);

};

//cardIdx patch 함수
exports.patchCardIdx = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const cardIdx = req.body.cardIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!cardIdx) return res.send(errResponse(baseResponse.COURSE_CARDIDX_EMPTY));
    
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }


    const editCardIdxInfo = await courseService.editCardIdx(courseIdx, cardIdx);
    
    return res.send(editCardIdxInfo);
};

//latitude, longitude patch 함수
exports.patchRegion = async function (req, res) {

    const {userIdx, courseIdx} = req.params;
    const {latitude, longitude} = req.body;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!latitude) return res.send(errResponse(baseResponse.COURSE_LATITUDE_EMPTY));
    if (!longitude) return res.send(errResponse(baseResponse.COURSE_LONGITUDE_EMPTY));
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    
    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    const editRegionInfo = await courseService.editRegion(courseIdx, latitude, longitude);
    return res.send(editRegionInfo);
    
};

//hashTag 입력
exports.postCourseHashTag = async function(req, res){

    // JWT 검증
    const userIdx = req.params.userIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    const {courseIdx, hashTagIdx} = req.params;
    // 빈 값 체크
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!hashTagIdx) return res.send(errResponse(baseResponse.COURSE_HASHTAGIDX_EMPTY));

    const postCourseHashTagResponse = await courseService.createCourseHashTag(
        courseIdx, 
        hashTagIdx
    );
    // postCourseResponse 값을 json으로 전달
    return res.send(postCourseHashTagResponse);
};

//발자국 삭제 api
exports.deleteCourse = async function (req, res) {

    //req : courseIdx
    const {userIdx, courseIdx} = req.params;
    // validation
    if (!courseIdx) return res.send(errResponse(baseResponse.COURSE_COURSEIDX_EMPTY));
    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    
    // JWT 검증
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) 
      return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));

    const verifyCourseUserResult = await courseService.verifyUserInCourse(userIdx, courseIdx);
    if(!verifyCourseUserResult.isSuccess){
      return res.send(verifyCourseUserResult);
    }

    const eraseCourseInfo = await courseService.eraseCourse(courseIdx);

    //최종 반환
    return res.send(eraseCourseInfo);
    
};

//썸네일 사진 업데이트 (jwt 적용 아직 안됨)
exports.patchTripImg = async function (req, res) {

    const tripIdx = req.params.tripIdx;
    const tripImg = req.body.tripImg;
    const userIdx = req.params.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.COURSE_USERIDX_EMPTY));
    if (!tripIdx) return res.send(errResponse(baseResponse.TRIPIMG_TRIPIDX_EMPTY));
    if (!tripImg) return res.send(errResponse(baseResponse.TRIPIMG_TRIPIMG_EMPTY));

    const editTripInfo = await courseService.editTripImg(tripIdx, tripImg)
    return res.send(editTripInfo);
    
};


