module.exports = function(app){
    const trip = require('./tripController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test/trip', trip.getTest);

    // 1. HOME
    // 1-1. 특정 여행 조회 API
    app.get('/app/trips/:tripIdx',trip.getTrip);

};