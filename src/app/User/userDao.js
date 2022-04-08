
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
      WHERE userIdx = ?;
    `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userIdx
  );
  return selectUserAccountRow;
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

async function updateTokens(connection, userIdx, accessToken, refreshToken) {
  const updateTokensQuery = `
    UPDATE user
    SET accessToken = ? , refreshToken = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateTokensRow = await connection.query(updateTokensQuery, [accessToken, refreshToken, userIdx]);
  return updateTokensRow[0];
}

async function userLogOut(connection, userIdx) {
  const updateTokensQuery = `
    UPDATE user
    SET accessToken = null , refreshToken = null, kakaoRefreshToken = null
    WHERE userIdx = ? ;
  `;
  const updateTokensRow = await connection.query(updateTokensQuery, userIdx);
  return updateTokensRow[0];
}

async function updateAccessToken(connection, userIdx, accessToken) {
  const updateAccessTokenQuery = `
    UPDATE user
    SET accessToken = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateAccessTokenRow = await connection.query(updateAccessTokenQuery, [accessToken, userIdx]);
  return updateAccessTokenRow[0];
}

async function selectRefreshToken(connection, userIdx) {
  const selectRefreshTokenQuery = `
    SELECT *
    FROM user
    WHERE userIdx = ? and status = 'ACTIVE' ;
    `;
  const [refreshTokenRow] = await connection.query(selectRefreshTokenQuery, userIdx);
  return refreshTokenRow;
}

async function selectAccessToken(connection, userIdx) {
  const selectAccessTokenQuery = `
    SELECT accessToken
    FROM user
    WHERE userIdx = ? and status = 'ACTIVE';
    `;
  const [accessTokenRow] = await connection.query(selectAccessTokenQuery, userIdx);
  return accessTokenRow;
}

async function updateKakaoRefreshToken(connection, userIdx, kakaoRefreshToken) {
  const updateKakaoRefreshTokenQuery = `
    UPDATE user
    SET kakaoRefreshToken = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateKakaoRefreshTokenRow = await connection.query(updateKakaoRefreshTokenQuery, [kakaoRefreshToken, userIdx]);
  return updateKakaoRefreshTokenRow[0];
}

async function updateTokensByKakaoSignIn(connection, updateTokensByKakaoSignInParams) {
  const updateTokensByKakaoSignInQuery = `
    UPDATE user
    SET accessToken = ? , refreshToken = ?, kakaoRefreshToken = ?
    WHERE userIdx = ? and status = 'ACTIVE';
  `;
  const updateTokensByKakaoSignInRow = await connection.query(updateTokensByKakaoSignInQuery, updateTokensByKakaoSignInParams);
  return updateTokensByKakaoSignInRow[0];
}

// userProfile 조회
async function selectUserProfileByIdx(connection, userIdx) {
  const selectUserProfileByIdxQuery = `
    SELECT *
    FROM userProfile
    WHERE userIdx = ? and status = 'ACTIVE';
    `;
  const [userProfileRow] = await connection.query(selectUserProfileByIdxQuery, userIdx);
  return userProfileRow;
}

// deleteUser
async function deleteUser(connection, userIdx) {
  const deleteUserQuery = `
    UPDATE user u
    LEFT JOIN userProfile uP ON u.userIdx = uP.userIdx
    SET u.status = 'DELETE', uP.status = 'DELETE'
    WHERE uP.userIdx = ? AND uP.status ='ACTIVE';
    `;
  const [deleteUserInfo] = await connection.query(deleteUserQuery, userIdx);
  return deleteUserInfo;
}

module.exports = {
  selectUser,
  selectUserByEmail,
  insertUserInfo,
  selectUserAccount,
  updateUserInfo,
  insertUserProfileInfo,
  updateKakaoUserInfo,
  updateTokens,
  updateAccessToken,
  selectRefreshToken,
  selectAccessToken,
  userLogOut,
  updateKakaoRefreshToken,
  updateTokensByKakaoSignIn,
  selectUserProfileByIdx,
  deleteUser
};
