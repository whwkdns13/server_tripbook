module.exports = function(app){
    const trip = require('./tripController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test/trip', trip.getTest);

    // 1. HOME
    // 1-1. 특정 여행 조회 API
    app.get('/app/trip/:tripIdx',trip.getTrip);

    // 1-2. 유저 전체 여행 조회 API
    app.get('/app/trips/:userIdx',trip.getTrips);

    // 1-3. 특정 여행의 발자국 조회 API
    app.get('/app/trips/:tripIdx/courses',trip.getTripCourses)

    //TODO 1-1 + 1-3 = 홈 메인화면
}