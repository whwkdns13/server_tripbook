
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.
// courseIdx로 모든 course정보 받아서 배열로 리턴해주는 함수
async function selectCourseIdx(connection, courseIdx) {
    const selectCourseIdxQuery = `
                   SELECT * 
                   FROM tripCourse 
                   WHERE courseIdx = ?;
                   `;
    const [courseRow] = await connection.query(selectCourseIdxQuery, courseIdx);
    return courseRow;
  }
  
async function insertCourseInfo(connection, insertCourseInfoParams) {
  const insertCourseInfoQuery = `
        INSERT INTO tripCourse(courseTitle, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertCourseInfoRow = await connection.query(
    insertCourseInfoQuery,
    insertCourseInfoParams
  );

  return insertCourseInfoRow;
}

async function changeCourseStatusDelete(connection, courseIdx) {
  const deleteCourseInfoQuery = `
        UPDATE tripCourse 
        SET status = 'DELETE' 
        WHERE courseIdx = ?;
    `;
  const deleteCourseInfoRow = await connection.query(deleteCourseInfoQuery, courseIdx);

  return deleteCourseInfoRow;
}

module.exports = {
    selectCourseIdx,
    insertCourseInfo,
    changeCourseStatusDelete
};
