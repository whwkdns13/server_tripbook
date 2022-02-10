module.exports = function(app){
    const trip = require('./tripController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // TEST
    // 0. 테스트 API
    app.get('/app/test/trip', trip.getTest);

    // 1-1. 최근 여행 조회 API
    app.get('/app/trip/latest/:userIdx',trip.getLatestTrip);

    // 1-2. 최근 여행 발자국 조회 API
    app.get('/app/trip/latest/:userIdx/courses',trip.getLatestCourses);

    // 1-3. 전체 여행 수 조회 API
    app.get('/app/trips/count/:userIdx',trip.getTripsCount);

    // 2. TRIP
    // 2-1. 특정 여행 조회 API
    app.get('/app/trip/:tripIdx',trip.getTrip);

    // 2-2. 특정 여행 발자국 조회 API
    app.get('/app/trip/:tripIdx/courses',trip.getTripCourses);

    // 2-3. 여행 생성 API
    // TODO TRIPIMG DEFAULT값, NULL YET
    app.post('/app/trip',trip.postTrip);

    // 2-4. 여행 제목 수정 API
    app.patch('/app/trip/:tripIdx/triptitle',trip.patchTripTitle);

    // 2-5. 여행 출발 날짜 수정 API
    app.patch('/app/trip/:tripIdx/departuredate',trip.patchDepartureDate);

    // 2-6. 여행 도착 날짜 수정 API
    app.patch('/app/trip/:tripIdx/arrivaldate',trip.patchArrivalDate);

    // 2-7. 여행 테마 수정 API
    app.patch('/app/trip/:tripIdx/theme',trip.patchTheme);


    // 3. PAST TRIPS
    // 3-1. 유저 전체 여행 조회 API
    app.get('/app/trips/:userIdx',trip.getTrips);
}