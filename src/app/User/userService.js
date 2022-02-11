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
        return response(baseResponse.SIGNUP_USER_SUCCESS);

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
        return response(baseResponse.SIGNUP_USERPROFILE_SUCCESS);

    } catch (err) {
        logger.error(`App - createKakaoUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.SigninByRefreshToken = async function (userIdx) {
    try {
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userIdx);

        if (userInfoRows[0].status === "DELETE") 
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        console.log(userIdx); // 로그인한 userIdx

        //토큰 생성 Service 유효기간 1시간
        const accessToken = await jwt.sign(
            {
                userIdx: userInfoRows[0].userIdx,
                email: userInfoRows[0].email
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "1h",
                subject: "user",
            } // 유효 기간 1일
        );

        //refresh 토큰 생성 유효기간 14일
        const refreshToken = await jwt.sign(
            {userIdx: userInfoRows[0].userIdx}, // 비워놓음 (오버헤드 최소화)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "14d",
                subject: "user",
            } // 유효 기간 1일
        );

        //refresh 토큰 DB에 넣기
        const connection = await pool.getConnection(async (conn) => conn);
        const updateTokensResult = await userDao.updateTokens(connection, userIdx, accessToken, refreshToken);
        connection.release();
        
        if(updateTokensResult.affectedRows === 1){
            return response(baseResponse.SUCCESS, {
                'userIdx': userIdx, 
                'jwt': accessToken , 
                'jwtRefreshToken' : refreshToken
            });
        }
        else return errResponse(baseResponse.USER_USERIDX_NOT_EXIST);

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 카카오 로그인
exports.kakaoSignin = async function (userIdx, kakaoRefreshToken) {
    try {
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userIdx);

        if (userInfoRows[0].status === "DELETE") 
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        console.log(userIdx); // 로그인한 userIdx

        //토큰 생성 Service 유효기간 1시간
        const accessToken = await jwt.sign(
            {
                userIdx: userInfoRows[0].userIdx,
                email: userInfoRows[0].email
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "1h",
                subject: "user",
            } // 유효 기간 1시간
        );

        //refresh 토큰 생성 유효기간 14일
        const refreshToken = await jwt.sign(
            {userIdx: userInfoRows[0].userIdx}, // 이메일 제외 (오버헤드 최소화)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "14d",
                subject: "user",
            } // 유효 기간 14일
        );

        //refresh 토큰 DB에 넣기
        const connection = await pool.getConnection(async (conn) => conn);
        const updateTokensByKakaoSignInParams = [ accessToken, refreshToken, kakaoRefreshToken, userIdx];
        const updateTokensResult = await userDao.updateTokensByKakaoSignIn(connection, updateTokensByKakaoSignInParams);
        connection.release();
        
        if(updateTokensResult.affectedRows === 1){
            return response(baseResponse.SUCCESS, {
                'userIdx': userIdx, 
                'jwt': accessToken , 
                'jwtRefreshToken' : refreshToken
            });
        }
        else return errResponse(baseResponse.USER_USERIDX_NOT_EXIST);

    } catch (err) {
        logger.error(`App - kakaoSignin Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//강제 로그아웃
exports.logOut = async function (userIdx) {
    try {
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userIdx);

        if (userInfoRows[0].status === "DELETE") 
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        console.log(userIdx); // 로그아웃 userIdx

        //refresh 토큰 DB에 넣기
        const connection = await pool.getConnection(async (conn) => conn);
        const userLogOutResult = await userDao.userLogOut(connection, userIdx);
        connection.release();

        if(userLogOutResult.affectedRows === 1){
            return response(baseResponse.USER_USER_LOGOUT_SUCCESS);
        }
        else return errResponse(baseResponse.USER_USER_NOT_EXIST);

    } catch (err) {
        logger.error(`App - logOut Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editAccessToken = async function (userIdx, accessToken) {
    try {
        console.log(userIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateAccessToken(connection, userIdx, accessToken)
        connection.release();
        if(editUserResult.affectedRows === 1){
            return response(baseResponse.TOKEN_ACCESSTOKEN_UPDATE);
        }
        else return errResponse(baseResponse.USER_USER_NOT_EXIST);

    } catch (err) {
        logger.error(`App - editAccessToken Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editKakaoRefreshToken = async function (userIdx, kakaoRefreshToken) {
    try {
        console.log(userIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateKakaoRefreshToken(connection, userIdx, kakaoRefreshToken);
        connection.release();
        if(editUserResult.affectedRows === 1){
            return response(baseResponse.SUCCESS);
        }
        else return errResponse(baseResponse.USER_USER_NOT_EXIST);

    } catch (err) {
        logger.error(`App - editKakaoRefreshToken Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

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