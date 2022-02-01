
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

//courseDate SET DAO
async function updateCourseDate(connection, courseIdx, courseDate) {
  const updateCourseDateQuery = `
  UPDATE tripCourse 
  SET courseDate = ?
  WHERE courseIdx = ?;`;
  const updateCourseDateRow = await connection.query(updateCourseDateQuery, [courseDate, courseIdx]);
  return updateCourseDateRow[0];
}

//courseTime SET DAO
async function updateCourseTime(connection, courseIdx, courseTime) {
  const updateCourseTimeQuery = `
  UPDATE tripCourse 
  SET courseTime = ?
  WHERE courseIdx = ?;`;
  const updateCourseTimeRow = await connection.query(updateCourseTimeQuery, [courseTime, courseIdx]);
  return updateCourseTimeRow[0];
}

//courseTitle SET DAO
async function updateCourseTitle(connection, courseIdx, courseTitle) {
  const updateCourseTitleQuery = `
  UPDATE tripCourse 
  SET courseTitle = ?
  WHERE courseIdx = ?;`;
  const updateCourseTitleRow = await connection.query(updateCourseTitleQuery, [courseTitle, courseIdx]);
  return updateCourseTitleRow[0];
}

//courseImg SET DAO
async function updateCourseImg(connection, courseIdx, courseImg) {
  const updateCourseImgQuery = `
  UPDATE tripCourse 
  SET courseImg = ?
  WHERE courseIdx = ?;`;
  const updateCourseImgRow = await connection.query(updateCourseImgQuery, [courseImg, courseIdx]);
  return updateCourseImgRow[0];
}

//courseComment SET DAO
async function updateCourseComment(connection, courseIdx, courseComment) {
  const updateCourseCommentQuery = `
  UPDATE tripCourse 
  SET courseComment = ?
  WHERE courseIdx = ?;`;
  const updateCourseCommentRow = await connection.query(updateCourseCommentQuery, [courseComment, courseIdx]);
  return updateCourseCommentRow[0];
}

//cardIdx SET DAO
async function updateCardIdx(connection, courseIdx, cardIdx) {
  const updateCardIdxQuery = `
  UPDATE tripCourse 
  SET cardIdx = ?
  WHERE courseIdx = ?;`;
  const updateCardIdxRow = await connection.query(updateCardIdxQuery, [cardIdx, courseIdx]);
  return updateCardIdxRow[0];
}


module.exports = {
    selectCourseIdx,
    insertCourseInfo,
    updateCourseDate,
    updateCourseTime,
    updateCourseTitle,
    updateCourseImg,
    updateCourseComment,
    updateCardIdx
};
