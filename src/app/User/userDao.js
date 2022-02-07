
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT * 
                FROM user;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserKakaoId(connection, kakaoId) {
  const selectUserKakaoIdQuery = `
                 SELECT *
                 FROM user
                 WHERE kakaoId = ?;
                 `;
  const [userRow] = await connection.query(selectUserKakaoIdQuery,kakaoId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, kakaoId) {
  const insertUserInfoQuery = `
        INSERT INTO user(kakaoId)
        VALUES (?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    kakaoId
  );
  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userIdx) {
  const selectUserAccountQuery = `
        SELECT status, userIdx, kakaoId
        FROM user
        WHERE userIdx = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userIdx
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserKakaoId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo
};
