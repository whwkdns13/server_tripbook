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

exports.accountCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, userIdx);
  connection.release();
  
  return userAccountResult;
};