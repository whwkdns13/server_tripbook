const jwtMiddleware = require("../../../config/jwtMiddleware");
const tripProvider = require("../Trip/tripProvider");
const tripService = require("../Trip/tripService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

// TEST
/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test/trip
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
};


// HOME
/**
 * API No. 1-1
 * API Name : 최근 여행 조회 API
 * [GET] /app/trip/latest/:userIdx
 */
exports.getLatestTrip = async function (req, res) {
    /**
     * Path Variable: userIdx
     */

    const userIdx = req.params.userIdx;
    // errResponse 전달
    if(!userIdx) return res.send(errResponse(baseResponse.TRIP_USERIDX_EMPTY));    

    // 최근 여행 인덱스 조회
    const latestTripIdx = await tripProvider.retrieveLatest(userIdx);

    // errResponse 전달 - 최근 여행 인덱스 없을때
    if(!latestTripIdx) return res.send(response(baseResponse.TRIP_LATEST_NOT_EXIST));

    const latestTripInfo = await tripProvider.retrieveTrip(latestTripIdx.tripIdx);

    return res.send(response(baseResponse.SUCCESS, latestTripInfo));
};

/**
 * API No. 1-2
 * API Name : 최근 여행 발자국 조회 API
 * [GET] /app/trip/latest/:userIdx/courses
 */
exports.getLatestCourses = async function (req, res) {
    /**
     * Path Variable: userIdx
     */

    const userIdx = req.params.userIdx;
    // errResponse 전달
    if(!userIdx) return res.send(errResponse(baseResponse.TRIP_USERIDX_EMPTY));

    // 최근 여행 인덱스 조회
    const latestTripIdx = await tripProvider.retrieveLatest(userIdx);

    // errResponse 전달 - 최근 여행 인덱스 없을때
    if(!latestTripIdx) return res.send(response(baseResponse.TRIP_LATEST_NOT_EXIST));

    const latestCoursesInfo = await tripProvider.retrieveCourses(latestTripIdx.tripIdx);

    // errResponse 전달 - 최근 여행의 course가 없을 때
    if(!latestCoursesInfo) return res.send(response(baseResponse.TRIP_COURSE_NOT_EXIST));
    return res.send(response(baseResponse.SUCCESS, latestCoursesInfo));
};

/**
 * API No. 1-3
 * API Name : 전체 여행 수 조회 API
 * [GET] /app/trips/count/:userIdx
 */
exports.getTripsCount = async function (req, res) {
    /**
     * Path Variable: userIdx
     */

    const userIdx = req.params.userIdx;
    // errResponse 전달
    if(!userIdx) return res.send(errResponse(baseResponse.TRIP_USERIDX_EMPTY));

    const tripsCount = await tripProvider.retrieveTripsCount(userIdx);
    return res.send(response(baseResponse.SUCCESS, tripsCount));
};


// TRIP
/**
 * API No. 2-1
 * API Name : 특정 여행 조회 API
 * [GET] /app/trip/:tripIdx
 */
exports.getTrip = async function (req, res) {
    /**
     * Path Variable: tripIdx
     */

    const tripIdx = req.params.tripIdx;
    // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));

    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);

    // errResponse 전달 - DELETE된 trip일 때
    if(tripBytripIdx.status == 'DELETE') return res.send(response(baseResponse.TRIP_DELETE_TRIP));
    return res.send(response(baseResponse.SUCCESS, tripBytripIdx));
};

/**
 * API No. 2-2
 * API Name : 특정 여행 발자국 조회 API
 * [GET] /app/trip/:tripIdx/courses
 */
exports.getTripCourses = async function (req, res) {
    /**
     * Path Variable: tripIdx
     */

    const tripIdx = req.params.tripIdx;
    // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));

    const coursesBytripIdx = await tripProvider.retrieveCourses(tripIdx);
    return res.send(response(baseResponse.SUCCESS, coursesBytripIdx));
};

/**
 * API No. 2-3
 * API Name : 여행 생성 API
 * [POST] /app/trip
 */
exports.postTrip = async function (req, res) {
    /**
     * Body: userIdx, tripTitle, departureDate, arrivalDate, themeIdx
     * tripImg = 1st courseImg default
     */

    const {userIdx, tripTitle, departureDate, arrivalDate, themeIdx} = req.body;

    // 빈 값 체크
    if(!userIdx) return res.send(response(baseResponse.TRIP_USERIDX_EMPTY));
    //TODO USER_USERID_NOEXIST 확인 필요
    //triptitle 길이 체크
    if(tripTitle.length > 14) return res.send(response(baseResponse.TRIP_TRIPTITLE_LENGTH));
    if(!tripTitle) return res.send(errResponse(baseResponse.TRIP_TRIPTITLE_EMPTY));
    if(!departureDate) return res.send(errResponse(baseResponse.TRIP_DEPARTUREDATE_EMPTY));
    if(!arrivalDate) return res.send(errResponse(baseResponse.TRIP_ARRIVALDATE_EMPTY));
    if(!themeIdx) return res.send(errResponse(baseResponse.TRIP_THEMEIDX_EMPTY));

    // TODO DATE유효성 검사

    const postTripResponse = await tripService.createTrip(
        userIdx,
        tripTitle,
        departureDate,
        arrivalDate,
        themeIdx
    );
    return res.send(postTripResponse);
};


/**
 * API No. 2-4
 * API Name : 여행 제목 수정 API
 * [PATCH] /app/trip/:tripIdx/triptitle
 */
exports.patchTripTitle = async function (req, res) {
    /**
     * Path Variable: tripIdx
     * Body : tripTitle
     */
    const tripIdx = req.params.tripIdx;
    const tripTitle = req.body.tripTitle;
     // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));
    if(!tripTitle) return res.send(errResponse(baseResponse.TRIP_TRIPTITLE_EMPTY));
    
    //triptitle 길이 체크
    if(tripTitle.length > 14) return res.send(response(baseResponse.TRIP_TRIPTITLE_LENGTH));
    
    // errResponse 전달 - DELETE된 trip일 때
    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    if(tripBytripIdx.status == 'DELETE') return res.send(response(baseResponse.TRIP_DELETE_TRIP));

    const editTripTitleInfo = await tripService.editTripTitle(tripIdx, tripTitle);
    return res.send(response(baseResponse.SUCCESS));
};


/**
 * API No. 2-5
 * API Name : 여행 출발 날짜 수정 API
 * [PATCH] app/trip/:tripIdx/departuredate
 */
exports.patchDepartureDate = async function (req, res) {
    /**
     * Path Variable: tripIdx
     * Body : departureDate
     */
    const tripIdx = req.params.tripIdx;
    const departureDate = req.body.departureDate;
     // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));
    if(!departureDate) return res.send(errResponse(baseResponse.TRIP_DEPARTUREDATE_EMPTY));

    // errResponse 전달 - DELETE된 trip일 때
    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    if(tripBytripIdx.status == 'DELETE') return res.send(response(baseResponse.TRIP_DELETE_TRIP));

    // TODO departureDate DATE 유효성 검사

    const editDepatureInfo = await tripService.editDepartureDate(tripIdx, departureDate);
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 2-6
 * API Name : 여행 도착 날짜 수정 API
 * [PATCH] app/trip/:tripIdx/arrivaldate
 */
exports.patchArrivalDate = async function (req, res) {
    /**
     * Path Variable: tripIdx
     * Body : arrivalDate
     */
    const tripIdx = req.params.tripIdx;
    const arrivalDate = req.body.arrivalDate;
     // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));
    if(!arrivalDate) return res.send(errResponse(baseResponse.TRIP_ARRIVALDATE_EMPTY));

    // errResponse 전달 - DELETE된 trip일 때
    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    if(tripBytripIdx.status == 'DELETE') return res.send(response(baseResponse.TRIP_DELETE_TRIP));

    // TODO arrivalDate DATE 유효성 검사

    const editArrivalDateInfo = await tripService.editArrivalDate(tripIdx, arrivalDate);
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 2-7
 * API Name : 여행 테마 수정 API
 * [PATCH] app/trip/:tripIdx/theme
 */
exports.patchTheme = async function (req, res) {
    /**
     * Path Variable: tripIdx
     * Body : theme
     */
    const tripIdx = req.params.tripIdx;
    const theme = req.body.theme;
     // errResponse 전달
    if(!tripIdx) return res.send(errResponse(baseResponse.TRIP_TRIPIDX_EMPTY));
    if(!theme) return res.send(errResponse(baseResponse.TRIP_THEMEIDX_EMPTY));

    // errResponse 전달 - DELETE된 trip일 때
    const tripBytripIdx = await tripProvider.retrieveTrip(tripIdx);
    if(tripBytripIdx.status == 'DELETE') return res.send(response(baseResponse.TRIP_DELETE_TRIP));

    // TODO theme가 INT인지?

    const editTripThemeInfo = await tripService.editTripTheme(tripIdx, theme);
    return res.send(response(baseResponse.SUCCESS));
};


// PAST TRIPS
/**
 * API No. 3-1
 * API Name : 유저 전체 여행 조회 API
 * [GET] /app/trips/:userIdx
 */
exports.getTrips = async function (req, res) {
    /**
     * Path Variable: userIdx
     */

    const userIdx = req.params.userIdx;
    // errResponse 전달
    if(!userIdx) return res.send(errResponse(baseResponse.TRIP_USERIDX_EMPTY));

    const tripsByuserIdx = await tripProvider.retrieveTrips(userIdx);
    return res.send(response(baseResponse.SUCCESS, tripsByuserIdx));
};