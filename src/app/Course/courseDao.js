
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

async function selectCourseIdx(connection, courseIdx) {
    const selectCourseIdxQuery = `
                   SELECT * 
                   FROM tripCourse 
                   WHERE courseIdx = ?;
                   `;
    const [courseRow] = await connection.query(selectCourseIdxQuery, courseIdx);
    return courseRow;
  }
//course정보 받아와서 DB에 저장해주는 함수
async function insertCourseInfo(connection, insertCourseInfoParams) {
  const insertCourseInfoQuery = `
    INSERT INTO tripCourse (tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment) 
    VALUE (?,?,?,?,?,?);
    `;
  const insertCourseInfoRow = await connection.query(
    insertCourseInfoQuery,
    insertCourseInfoParams
  );
  return insertCourseInfoRow;
}

module.exports = {
    selectCourseIdx,
    insertCourseInfo
};
