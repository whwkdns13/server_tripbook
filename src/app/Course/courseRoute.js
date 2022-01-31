module.exports = function(app){
    const jwtMiddleware = require('../../../config/jwtMiddleware');    
    const course = require('./courseController');


    // 0. 테스트 API
    app.get('/app/test/course', course.getTest);
    
    //course가져오기 api
    app.get('/app/course/:courseIdx', course.getCourseByIdx);
    
    //course등록 api
    app.post('/app/course', course.postCourse);

};

   
