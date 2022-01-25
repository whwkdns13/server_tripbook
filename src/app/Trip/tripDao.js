// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// tripIdx -> trip
async function selectTrip(connection, tripIdx) {
  const selectTripQuery = `
    SELECT *
    FROM trip
    WHERE tripIdx = ?;
    `;
  const [tripRows] = await connection.query(selectTripQuery, tripIdx);
  return tripRows[0];
}

// userIdx -> trips
async function selectTrips(connection, userIdx) {
  const selectTripsQuery = `
    SELECT *
    FROM trip
    WHERE userIdx = ?;
    `;
  const [tripsRows] = await connection.query(selectTripsQuery, userIdx);
  return tripsRows;
}

// tripIdx -> tripCourses
async function selectCourses(connection, tripIdx) {
  const selectCoursesQuery = `
    SELECT *
    FROM tripCourse
    WHERE tripIdx = ?;
    `;
  const [courseRows] = await connection.query(selectCoursesQuery, tripIdx);
  return courseRows;
}

// userIdx -> Latest tripIdx
async function selectLatestTrip(connection, userIdx) {
  const selectLatestTripQuery = `
    SELECT *
    FROM trip
    WHERE userIdx = ?;
    `;
  const latestTripIdx = await connection.query(selectLatestTripQuery, userIdx);
  return latestTripIdx;
}

module.exports = {
  selectTrip,
  selectTrips,
  selectCourses,
  selectLatestTrip
};
