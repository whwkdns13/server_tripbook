
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT * 
                FROM user
                WHERE status = 'ACTIVE';
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// user 회원 조회
async function selectUserByEmail(connection, email) {
  const selectUserEmailQuery = `
                 SELECT *
                 FROM user
                 WHERE email = ? and status = 'ACTIVE';
                 `;
  const [userRow] = await connection.query(selectUserEmailQuery, email);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, email) {
  const insertUserInfoQuery = `
        INSERT INTO user(email)
        VALUES (?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    email
  );
  return insertUserInfoRow;
}

async function insertUserProfileInfo(connection, kakaoSignUpParams) {
  const insertUserProfileInfoQuery = `
        INSERT INTO userProfile (userIdx, nickName, userImg)
        VALUES (?,?,?);
    `;
  const insertUserProfileInfoRow = await connection.query(
    insertUserProfileInfoQuery,
    kakaoSignUpParams
  );
  return insertUserProfileInfoRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userIdx) {
  const selectUserAccountQuery = `
          SELECT status, userIdx, email
          FROM user
          WHERE userIdx = ? and status = 'ACTIVE';
        `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userIdx
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickName) {
  const updateUserQuery = `
    UPDATE userProfile
    SET nickName = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateUserRow = await connection.query(updateUserQuery, [nickName, id]);
  return updateUserRow[0];
}

async function updateKakaoUserInfo(connection, editKakaoUserParams) {
  const updateUserQuery = `
    UPDATE userProfile
    SET nickName = ?, userImg = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateUserRow = await connection.query(updateUserQuery, editKakaoUserParams);
  return updateUserRow[0];
}

async function updateRefreshToken(connection, userIdx, refreshToken) {
  const updateUserQuery = `
    UPDATE user
    SET refreshToken = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateUserRow = await connection.query(updateUserQuery, [refreshToken, userIdx]);
  return updateUserRow[0];
}

async function selectRefreshToken(connection, userIdx) {
  const selectRefreshTokenQuery = `
                 SELECT *
                 FROM user
                 WHERE userIdx = ? and status = 'ACTIVE';
                 `;
  const [refreshTokenRow] = await connection.query(selectRefreshTokenQuery, userIdx);
  return refreshTokenRow;
}

module.exports = {
  selectUser,
  selectUserByEmail,
  insertUserInfo,
  selectUserAccount,
  updateUserInfo,
  insertUserProfileInfo,
  updateKakaoUserInfo,
  updateRefreshToken,
  selectRefreshToken
};
