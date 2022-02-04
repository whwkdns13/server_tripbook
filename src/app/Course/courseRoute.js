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
    

    //발자국 삭제 api
    app.patch('/app/course/deleteCourse/:courseIdx', course.deleteCourse);
};

   
