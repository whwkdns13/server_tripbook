// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// tripIdx -> trip
async function selectTrip(connection, tripIdx) {
  const selectTripQuery = `
    SELECT tripIdx, userIdx, themeIdx, tripTitle, DATE_FORMAT(departureDate,'%Y-%m-%d') AS departureDate, DATE_FORMAT(arrivalDate,'%Y-%m-%d') AS arrivalDate, status
    FROM trip
    WHERE tripIdx = ?;
    `;
  const [tripRow] = await connection.query(selectTripQuery, tripIdx);
  return tripRow[0];
}

// userIdx -> trips
async function selectTrips(connection, userIdx) {
  const selectTripsQuery = `
    SELECT tripIdx, userIdx, themeIdx, tripImg, tripTitle, DATE_FORMAT(departureDate,'%Y-%m-%d') AS departureDate, DATE_FORMAT(arrivalDate,'%Y-%m-%d') AS arrivalDate, status
    FROM trip
    WHERE userIdx = ? AND status = 'ACTIVE'
    ORDER BY arrivalDate DESC, departureDate DESC;
    `;
  const [tripsRows] = await connection.query(selectTripsQuery, userIdx);
  return tripsRows;
}

// tripIdx -> tripCourses
async function selectCourses(connection, tripIdx) {
  const selectCoursesQuery = `
    SELECT courseIdx, tripIdx, cardIdx, courseImg, DATE_FORMAT(courseDate, '%Y-%m-%d') AS courseDate, courseTime, courseTitle, courseComment, latitude, longitude, status
    FROM tripCourse
    WHERE tripIdx = ? AND status = 'ACTIVE'
    ORDER BY cardIdx;
    `;
    //TODO course 순서 정하기
  const [courseRows] = await connection.query(selectCoursesQuery, tripIdx);
  return courseRows;
}

// userIdx -> Latest tripIdx
async function selectLatestTrip(connection, userIdx) {
  const selectLatestTripQuery = `
    SELECT tripIdx
    FROM trip
    WHERE userIdx = ? AND status ='ACTIVE'
    ORDER BY arrivalDate DESC, departureDate DESC;
    `;
  const [latestTripIdx] = await connection.query(selectLatestTripQuery, userIdx);
  return latestTripIdx[0];
}

// userIdx -> count trips
async function selectTripsCount(connection, userIdx) {
  const selectTripsCountQuery = `
    SELECT COUNT(*) AS TRIPS_COUNT
    FROM trip
    WHERE userIdx = ? AND status ='ACTIVE';
    `;
    const [tripsCount] = await connection.query(selectTripsCountQuery, userIdx);
    return tripsCount[0].TRIPS_COUNT;
}

// create Trip
async function insertTripInfo(connection, insertTripInfoParams) {
  const insertTripInfoQuery = `
        INSERT INTO trip(userIdx, tripTitle, departureDate, arrivalDate, themeIdx)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertPostInfoRow = await connection.query(
    insertTripInfoQuery,
    insertTripInfoParams
  );

  return insertPostInfoRow;
}

// update tripTitle
async function updateTripTitle(connection, editTripTitleParams) {
  const updateTripTitleQuery = `
    UPDATE trip 
    SET tripTitle = ?
    WHERE tripIdx = ?;
    `;
  const updateTripTitleInfoRow = await connection.query(
    updateTripTitleQuery,
    editTripTitleParams
  );

  return updateTripTitleInfoRow;
}

// update departureDate
async function updateDepartureDate(connection, editDepartureDateParams) {
  const updateDepartureDateQuery = `
    UPDATE trip 
    SET departureDate = ?
    WHERE tripIdx = ?;
    `;
  const updateDepartureDateInfoRow = await connection.query(
    updateDepartureDateQuery,
    editDepartureDateParams
  );

  return updateDepartureDateInfoRow;
}

// update arrivalDate
async function updateArrivalDate(connection, editArrivalDateParams) {
  const updateArrivalDateQuery = `
    UPDATE trip 
    SET arrivalDate = ?
    WHERE tripIdx = ?;
    `;
  const updateArrivalDateInfoRow = await connection.query(
    updateArrivalDateQuery,
    editArrivalDateParams
  );

  return updateArrivalDateInfoRow;
}

// update theme
async function updateTripTheme(connection, editTripThemeParams) {
  const updateTripThemeQuery = `
    UPDATE trip 
    SET themeIdx = ?
    WHERE tripIdx = ?;
    `;
  const updateTripThemeInfoRow = await connection.query(
    updateTripThemeQuery,
    editTripThemeParams
  );

  return updateTripThemeInfoRow;
}

// update theme
async function updateTrip(connection, editTripParams) {
  const updateTripQuery = `
    UPDATE trip 
    SET tripTitle = ?, themeIdx = ?, departureDate = ?, arrivalDate = ?
    WHERE tripIdx = ?;
    `;
  const updateTripInfoRow = await connection.query(
    updateTripQuery,
    editTripParams
  );

  return updateTripInfoRow;
}

async function verifyTripUser(connection, tripIdx) {
  const selectTripUserQuery = `
        SELECT userIdx
        FROM trip
        WHERE tripIdx = ? AND trip.status = 'ACTIVE';
        `;
  const [tripUser] = await connection.query(selectTripUserQuery, tripIdx);
  return tripUser[0];
}

 // 썸네일(대표사진)설정
async function updateTripImg(connection, updateTripImgParams) {
  const updateTripImgQuery = `
        UPDATE trip
        SET tripImg = ?
        WHERE tripIdx = ? AND status = 'ACTIVE';
    `;
  const updateTripImgInfoRow = await connection.query(
    updateTripImgQuery,
    updateTripImgParams
  );

  return updateTripImgInfoRow;
}

module.exports = {
  selectTrip,
  selectTrips,
  selectCourses,
  selectLatestTrip,
  selectTripsCount,
  insertTripInfo,
  updateTripTitle,
  updateDepartureDate,
  updateArrivalDate,
  updateTripTheme,
  updateTrip,
  verifyTripUser,
  updateTripImg
};
