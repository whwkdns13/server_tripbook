module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');    
    const course = require('./courseController');

    // 0. 테스트 API
    app.get('/app/course/test', course.getTest);
    

    //1.1 course가져오기 api
    app.get('/app/course/:userIdx/:courseIdx', jwtMiddleware, course.getCourseByIdx);
    
    //2.1 course등록 api
    app.post('/app/course/:userIdx', jwtMiddleware, course.postCourse);

    //2.2 courseHashTag 추가하기 api
    app.post('/app/course/hashTag/:userIdx/:courseIdx/:hashTagIdx', jwtMiddleware, course.postCourseHashTag);

    //3.0 course 전체 수정하기 API, userIdx는 jwt이용에 필요
    app.patch('/app/course/courseDate/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseDate);

    //3.1 courseDate 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseDate/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseDate);

    //3.2 courseTime 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseTime/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseTime);

    //3.3 courseTitle 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseTitle/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseTitle);

    //3.4 courseImg 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseImg/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseImg);

    //3.5 courseComment 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseComment/:userIdx/:courseIdx', jwtMiddleware, course.patchCourseComment);

    //3.6 cardIdx 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/cardIdx/:userIdx/:courseIdx', jwtMiddleware, course.patchCardIdx);

    //3.7 region 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/region/:userIdx/:courseIdx', jwtMiddleware, course.patchRegion);

    //4.1 발자국 삭제 api
    app.patch('/app/course/deleteCourse/:userIdx/:courseIdx', jwtMiddleware, course.deleteCourse);


};

