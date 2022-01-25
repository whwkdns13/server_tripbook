module.exports = function(app){
    const trip = require('./tripController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // TEST
    // 0. 테스트 API
    app.get('/app/test/trip', trip.getTest);


    // 1. HOME
    // 1-1. 최근 여행 조회 API
    app.get('/app/trip/latest/:userIdx',trip.getLatestTrip);

    // 1-2. 최근 여행 발자국 조회 API
    app.get('/app/trip/latest/:userIdx/courses',trip.getLatestCourses);

    // 1-3. 전체 여행 수 조회 API
    app.get('/app/trips/count/:userIdx',trip.getTripsCount)

    // 2. TRIP
    // 2-1. 특정 여행 조회 API
    app.get('/app/trip/:tripIdx',trip.getTrip);

    // 2-2. 특정 여행 발자국 조회 API
    app.get('/app/trip/:tripIdx/courses',trip.getTripCourses);


    // 3. PAST TRIPS
    // 3-1. 유저 전체 여행 조회 API
    app.get('/app/trips/:userIdx',trip.getTrips);
}