module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');    
    const course = require('./courseController');


    // 0. 테스트 API
    app.get('/app/course/test', course.getTest);
    
    //course가져오기 api
    app.get('/app/course/:courseIdx', course.getCourseByIdx);
    

    //courseDate 수정하기 API userIdx는 jwt이용에 필요
    app.patch('/app/course/courseDate/:userIdx/:courseIdx', course.patchCourseDate);

    //course등록 api
    app.post('/app/course', course.postCourse);

    //tripImg업데이트 api
    app.patch('/app/course/tripImg',course.patchTripImg);

    //courseHashTag 추가하기 api
    app.post('/app/course/hashTag/:courseIdx/:hashTagIdx',course.postCourseHashTag);

    //course등록 api
    app.post('/app/course', course.postCourse);

    //tripImg업데이트 api
    app.patch('/app/course/tripImg',course.patchTripImg);


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

