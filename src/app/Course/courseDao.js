
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.
// courseIdx로 모든 course정보 받아서 배열로 리턴해주는 함수
async function selectCourseIdx(connection, courseIdx) {
    const selectCourseIdxQuery = `
                   SELECT * 
                   FROM tripCourse 
                   WHERE courseIdx = ? AND status = 'ACTIVE';
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
async function selectCourseTag(connection, courseIdx) {
  const selectCourseTagQuery = `
                    SELECT hashtag.tagName, hashtag.tagType
                    FROM courseTagIdxRelationships LEFT OUTER JOIN hashtag
                    ON courseTagIdxRelationships.hashtagIdx = hashtag.hashtagIdx
                    WHERE courseIdx = ? AND courseTagIdxRelationships.status = 'ACTIVE';
                 `;
  const [courseTag] = await connection.query(selectCourseTagQuery, courseIdx);
  return courseTag;
}
module.exports = {
    selectCourseIdx,
    insertCourseInfo,
    selectCourseTag
};
