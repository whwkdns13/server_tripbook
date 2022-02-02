module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');    
    const course = require('./courseController');


    // 0. 테스트 API
    app.get('/app/course/test', course.getTest);
    
    //course가져오기 api
    app.get('/app/course/:courseIdx', course.getCourseByIdx);
    
    //course등록 api
    app.post('/app/course', course.postCourse);

    //tripImg업데이트 api
    app.post('/app/course/tripImg',course.patchTripImg);

    app.post('/app/course/hashTag/:courseIdx/:hashTagIdx',course.postCourseHashTag);

};