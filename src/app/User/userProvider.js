const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserByEmail = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserByEmail(connection, email);

  connection.release();

  return userResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.retrieveUserProfileByIdx = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserProfileByIdx(connection, userIdx);

  connection.release();

  return userResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.accountCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, userIdx);
  connection.release();
  
  return userAccountResult[0];
};

//리프레시 토큰 유저 idx로 가져오는 함수
exports.retrieveRefreshToken = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const refreshTokenResult = await userDao.selectRefreshToken(connection, userIdx);

  connection.release();

  return refreshTokenResult; 
};

//리프레시 토큰 유저 idx로 가져오는 함수
exports.retrieveAccessToken = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const accessTokenResult = await userDao.selectAccessToken(connection, userIdx);

  connection.release();

  return accessTokenResult[0].accessToken; 
};
