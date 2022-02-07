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
    WHERE userIdx = ? AND status = 'ACTIVE';
    `;
  const [tripsRows] = await connection.query(selectTripsQuery, userIdx);
  return tripsRows;
}

// tripIdx -> tripCourses
async function selectCourses(connection, tripIdx) {
  const selectCoursesQuery = `
    SELECT courseIdx, tripIdx, courseImg, DATE_FORMAT(courseDate, '%Y-%m-%d') AS courseDate, courseTime, courseTitle, courseComment, cardIdx, status
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
    ORDER BY arrivalDate DESC;
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
    return tripsCount[0];
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

module.exports = {
  selectTrip,
  selectTrips,
  selectCourses,
  selectLatestTrip,
  selectTripsCount,
  insertTripInfo
};
