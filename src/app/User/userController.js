const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const secret_config = require('../../../config/secret');
const regexEmail = require("regex-email");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userIdx
     */
    const userIdx = req.params.userIdx;
    // errResponse 전달
    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserIdx = await userProvider.retrieveUser(userIdx);
    return res.send(response(baseResponse.SUCCESS, userByUserIdx));
};

//카카오 리프레시 토큰을 이용해서 kakao토큰들 갱신 (카카오 액세스 토큰 유효기간 검증 후)
exports.updateKakaoTokens = async function (req, res) {
  //리프레시 토큰이 있으면 카카오 서버에서 액세스 받아옴
  const kakaoRefreshToken = req.body.kakaoRefreshToken;
  const userIdx = req.params.userIdx;
  if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
  if(!kakaoRefreshToken) return res.send(errResponse(baseResponse.KAKAO_REFRESHTOKEN_EMPTY));
  
  const refreshTokenResult = await userProvider.retrieveRefreshToken(userIdx);

  if(!refreshTokenResult.kakaoRefreshToken)
    return res.send(errResponse(baseResponse.KAKAO_REFRESHTOKEN_NOT_EXIST));
  if(refreshTokenResult.kakaoRefreshToken !== kakaoRefreshToken)
    return res.send(errResponse(baseResponse.KAKAO_REFRESHTOKEN_NOT_MATCH));
  
  let isRefreshExpired = false;
  let isAccessExpired = false;
  //디비에 있는 리프레시 토큰 유효기간 검증
  try{
    const verifyRefreshTokenResult = jwt.verify(refreshTokenResult.refreshToken, secret_config.jwtsecret);
  }catch(error){
    console.log(error);
    if(error.name === 'TokenExpiredError') {
      isRefreshExpired = true;
    }
  }
  //디비에 있는 액세스 토큰 유효기간 검증
  try{
    const verifyResult = jwt.verify(refreshTokenResult.accessToken, secret_config.jwtsecret);
  }catch(error){
    console.log(error);
    if(error.name === 'TokenExpiredError') {
      isAccessExpired = true;
    }
  }
  //access또는 refresh중 하나라도 만료 x시
  
  console.log(isAccessExpired);
  console.log(isRefreshExpired);


  //만료기간 지나기 전에 업데이트 요청했으므로 탈취가능성 존재
  //비정상적 접근 -> 로그아웃
  if(!isAccessExpired || !isRefreshExpired){
    const logOutReuslt = await userService.logOut(userIdx);
    return res.send(logOutReuslt);
  }

  //둘다 만료되면 정상 진행
  let kakaoProfile;	
  try {
      kakaoProfile = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        params: {
          grant_type: "refresh_token",
          client_id: "c9ef096f1e3ddc185556eda18530b133",
          refresh_token: kakaoRefreshToken
        }
      });
    } catch (error) {
      console.log(error.response.data);
      return res.send(errResponse(baseResponse.KAKAO_KAKAO_ERROR));
    }

    //갱신된 카카오 리프레시 토큰이 있을 시 저장해줌
    if(kakaoProfile.data.refresh_token){
      const updateKakaoRefreshTokenResult = await userService.editKakaoRefreshToken(userIdx, kakaoProfile.data.refresh_token, kakaoProfile.data)
      return res.send(updateKakaoRefreshTokenResult);
    }

    return res.send(response(baseResponse.SUCCESS,kakaoProfile.data));
}

//jwt없을 때 카카오 액세스 토큰으로 정보 불러와서 로그인
exports.kakaoSignin = async function (req, res) {
    const kakaoAccessToken = req.body.kakaoAccessToken;
    const kakaoRefreshToken = req.body.kakaoRefreshToken;
    let kakaoProfile;
    if(!kakaoAccessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
    if(!kakaoRefreshToken) return res.send(errResponse(baseResponse.KAKAO_REFRESHTOKEN_EMPTY));
	try {
        kakaoProfile = await axios({
          method: "GET",
          url: "https://kapi.kakao.com/v2/user/me",
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`
          }
        });
      } catch (error) {
        console.log(error.response.data);
        return res.send(errResponse(baseResponse.KAKAO_KAKAO_ERROR));
      }

      const email = kakaoProfile.data.kakao_account.email;
      const isUser = await userProvider.retrieveUserByEmail(email);
      //회원이 아니라면 회원가입 메시지를 보냄.
      if(!isUser) {
        return res.send(errResponse(baseResponse.USER_USER_NOT_EXIST));
      }
      //회원이라면 signIn시켜줌
      else{
        const kakaoSignInResult = await userService.kakaoSignin(isUser.userIdx, kakaoRefreshToken);
        return res.send(kakaoSignInResult);
      }
}

//카카오 정보로 회원가입 (유저 테이블)
exports.kakaoSignup = async function (req, res) {
  const kakaoAccessToken = req.body.kakaoAccessToken;
  if(!kakaoAccessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
  
  let kakaoProfile;
  try {
      kakaoProfile = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`
        }
      });
    } catch (error) {
      console.log(error.response.data);
      return res.send(errResponse(baseResponse.KAKAO_KAKAO_ERROR));
    }
    //이메일로 회원가입
    const email = kakaoProfile.data.kakao_account.email;

    const isUser = await userProvider.retrieveUserByEmail(email);
    //회원이 아닐 경우에만 회원가입
    if(!isUser) {
      const signUpUserResult = await userService.createKakaoUser(email);
      return res.send(signUpUserResult);    
    }
    else{
      return res.send(errResponse(baseResponse.USER_USER_EXIST));
    }
}

//카카오 정보로 회원가입 (유저 프로필)
exports.kakaoSignupProfile = async function (req, res) {
  const kakaoAccessToken = req.body.kakaoAccessToken;
  let kakaoProfile;
  if(!kakaoAccessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
  try {
      kakaoProfile = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`
        }
      });
    } catch (error) {
      console.log(error.response.data);
      return res.send(errResponse(baseResponse.KAKAO_KAKAO_ERROR, error.response.data));
    }

  const email = kakaoProfile.data.kakao_account.email;
  const nickName = kakaoProfile.data.kakao_account.profile.nickname;
  const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;
  const isUser = await userProvider.retrieveUserByEmail(email);
  if(!isUser) {
      return res.send(errResponse(baseResponse.USER_USER_NOT_EXIST));
  }
  else{
    const isProfileResult = await userProvider.retrieveUserProfileByIdx(isUser.userIdx);
    if(!isProfileResult) {
      const createUserProfileInfo = await userService.createKakaoUserProfile(isUser.userIdx, nickName, userImg);
      return res.send(createUserProfileInfo);
    }
    else{
      return res.send(errResponse(baseResponse.USER_USERPROFILE_EXIST));
    }
  } 
}    

//jwt있을 때 자동 로그인
exports.check = async function (req, res) {
  const userIdxResult = req.verifiedToken.userIdx;
  const userEmailResult = req.verifiedToken.email;
  if(!userEmailResult) 
    return res.send(errResponse(baseResponse.TOKEN_EMPTY));
  console.log(userIdxResult);
  return res.send(response(baseResponse.TOKEN_JWTVERIFICATION_SUCCESS, { userIdx : userIdxResult}));
};

  /**토큰 보안성 검사 
    *액세스 토큰 --> jwtmiddleware
      1. DB, 보내준 액세스 토큰 서로 같은지 확인 
      1-1. 같을 경우 -> 정상 인증(자동 로그인)
      1-2. 다를 경우 -> 에러 리스폰스
    *리프레시 토큰 --> userController.updateTokens
      2. DB, 보내준 리프레시 토큰 서로 같은지 확인 
      2-1. DB에 저장된 액세스 토큰 만료 확인 
      2-2. 만료시 정상적인 접근 재로그인 인정
      2-3. 만료 안됐을 시 비정상 접근, 둘 모두 파기하고 로그아웃
      (액세스 만료 안됐는데도 새로 발급 하려 함 ->refresh탈취 가능성 존재)
  */

//jwt토큰과 리프레시 토큰 갱신
exports.updateTokens = async function (req, res) {
  
  const userIdxFromRefresh = req.verifiedToken.userIdx;
  const refreshToken = req.body.refreshToken;
  const userIdx = req.params.userIdx;
  if (userIdxFromRefresh != userIdx)
    return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
  
  console.log(userIdxFromRefresh);
  const refreshTokenResult = await userProvider.retrieveRefreshToken(userIdxFromRefresh);
  //DB와 받은 리프레시 토큰이 다를 경우
  if(refreshTokenResult.refreshToken !== refreshToken)     
    return res.send(errResponse(baseResponse.TOKEN_REFRESHTOKEN_NOT_MATCH));
  //해당 회원 없을 시
  if (!refreshTokenResult) 
    return errResponse(baseResponse.USER_USER_NOT_EXIST);
  //refresh가 null일 시
  if(!refreshTokenResult.refreshToken) 
    return res.send(errResponse(baseResponse.USER_USER_LOGOUT));

  //디비에 있는 액세스 토큰 유효기간 검증
  try{
    const verifyResult = jwt.verify(refreshTokenResult.accessToken, secret_config.jwtsecret);
  }catch(error){
    console.log(error);
    if(error.name === 'TokenExpiredError') {
      //정상적인 접근이므로 토큰들 모두 업데이트 (재로그인)
      const refreshTokenSignInResult = await userService.SigninByRefreshToken(userIdxFromRefresh);
      return res.send(refreshTokenSignInResult);
    }

  }
  //만료기간 지나기 전에 업데이트 요청했으므로 탈취가능성 존재
  //비정상적 접근 -> 로그아웃
  const logOutReuslt = await userService.logOut(userIdxFromRefresh);
  return res.send(logOutReuslt);
};

//카카오 유저 닉네임, 썸네일 업데이트
exports.userUpdateByKakao = async function (req, res) {
    //const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const kakaoAccessToken = req.body.kakaoAccessToken;
    if(!kakaoAccessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    // JWT 검증
    //if (userIdxFromJWT != userIdx) 
    // return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    
    
      let kakaoProfile;
      try {
          kakaoProfile = await axios({
            method: "GET",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
              Authorization: `Bearer ${kakaoAccessToken}`
            }
          });
      } catch (error) {
        cconsole.log(error.response.data);
        return res.send(errResponse(baseResponse.KAKAO_KAKAO_ERROR));
      }
      const nickName = kakaoProfile.data.kakao_account.profile.nickname;
      const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;  
      
      const editkakaoUserInfoResult = await userService.editKakaoUser(userIdx, nickName, userImg);

      return res.send(editkakaoUserInfoResult);
    
}

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdxFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

