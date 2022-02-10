const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createKakaoUser = async function (email) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const kakaoSignUpResult = await userDao.insertUserInfo(connection, email);
        console.log(`추가된 회원 : ${kakaoSignUpResult[0].insertId}`)

        connection.release();
        return kakaoSignUpResult[0].insertId;

    } catch (err) {
        logger.error(`App - createKakaoUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createKakaoUserProfile = async function (userIdx, nickName, userImg) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        const kakaoSignUpParams = [userIdx, nickName, userImg];
        const userProfileResult = await userDao.insertUserProfileInfo(connection, kakaoSignUpParams);
        console.log(`추가된 회원프로필 : ${userProfileResult[0].insertId}`);

        connection.release();
        return true;

    } catch (err) {
        logger.error(`App - createKakaoUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userIdx) {
    try {
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userIdx);

        if (userInfoRows[0].status === "DELETE") 
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        console.log(userIdx); // 로그인한 userIdx

        //토큰 생성 Service 유효기간 1시간
        const accessToken = await jwt.sign(
            {
                userIdx: userInfoRows[0].userIdx,
                email: userInfoRows[0].email
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "user",
            } // 유효 기간 1일
        );

        //refresh 토큰 생성 유효기간 14일
        const refreshToken = await jwt.sign(
            {}, // 비워놓음 (오버헤드 최소화)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "14d",
                subject: "user",
            } // 유효 기간 1일
        );

        //refresh 토큰 DB에 넣기
        const connection = await pool.getConnection(async (conn) => conn);
        const createRefreshToken = await userDao.updateRefreshToken(connection, userIdx, refreshToken);
        connection.release();

        return response(baseResponse.SUCCESS, {
            'userIdx': userIdx, 
            'jwt': accessToken , 
            'jwtRefreshToken' : refreshToken
        });

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editKakaoUser = async function (userIdx, nickName, userImg) {
    try {
        console.log(userIdx);
        const editKakaoUserParams = [nickName, userImg, userIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const editKakaoUserResult = await userDao.updateKakaoUserInfo(connection, editKakaoUserParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editKakaoUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}