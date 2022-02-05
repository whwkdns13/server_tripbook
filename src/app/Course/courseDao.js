
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
      INSERT INTO tripCourse (tripIdx, courseImg, courseDate, courseTime, courseTitle, courseComment, cardIdx) 
      VALUE (?,?,?,?,?,?,?);
      `;
    const insertCourseInfoRow = await connection.query(
      insertCourseInfoQuery,
      insertCourseInfoParams
    );
    return insertCourseInfoRow;
  }


  // 썸네일(대표사진)설정
async function updateTripImg(connection, updateTripImgParams) {
  const updateTripImgQuery = `
        UPDATE trip
        SET tripImg = ?
        WHERE tripIdx = ?;
    `;
  const updateTripImgInfoRow = await connection.query(
    updateTripImgQuery,
    updateTripImgParams
  );

  return updateTripImgInfoRow;
}
async function selectCourseTag(connection, courseIdx) {
  const selectCourseTagQuery = `
                    SELECT courseTagIdxRelationships.relationIdx hashtag.tagName, hashtag.tagType
                    FROM courseTagIdxRelationships LEFT OUTER JOIN hashtag
                    ON courseTagIdxRelationships.hashtagIdx = hashtag.hashtagIdx
                    WHERE courseIdx = ? AND courseTagIdxRelationships.status = 'ACTIVE';
                 `;
  const [courseTag] = await connection.query(selectCourseTagQuery, courseIdx);
  return courseTag;
}


async function insertCourseHashTagInfo(connection, insertCourseHashTagInfoParams) {
  const insertCourseHashTagInfoQuery = `
        INSERT INTO courseTagIdxRelationships (courseIdx, hashtagIdx)
        VALUES (?,?);
    `;
  const insertCourseHashTagInfoRow = await connection.query(
    insertCourseHashTagInfoQuery,
    insertCourseHashTagInfoParams
  );

  return insertCourseHashTagInfoRow;
}

module.exports = {
    selectCourseIdx,
    insertCourseInfo,
    updateTripImg,
    selectCourseTag,
    insertCourseHashTagInfo

};
