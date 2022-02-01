module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');    
    const course = require('./courseController');


    // 0. 테스트 API
    app.get('/app/test/course', course.getTest);
    
    
    /** 여기서 부터 트립북 프로젝트
     * -발자국 보기 페이지
     * -파라미터
     */
    //코스 가져오기 Idx이용
    app.get('/app/course/:courseIdx', course.getCourseByIdx);
    
    //courseDate 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseDate/:userIdx/:courseIdx', course.patchCourseDate);

    //courseTime 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseTime/:userIdx/:courseIdx', course.patchCourseTime);

    //courseTitle 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseTitle/:userIdx/:courseIdx', course.patchCourseTitle);

    //courseImg 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseImg/:userIdx/:courseIdx', course.patchCourseImg);

    //courseComment 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseComment/:userIdx/:courseIdx', course.patchCourseComment);

    //cardIdx 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/cardIdx/:userIdx/:courseIdx', course.patchCardIdx);
};