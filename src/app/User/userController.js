const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const axios = require("axios");

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

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
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
exports.updateKakaoRefreshToken = async function (req, res) {
    //리프레시 토큰이 있으면 카카오 서버에서 액세스 받아옴
    const kakaoRefreshToken = req.body.kakaoRefreshToken;
    if(!kakaoRefreshToken) return res.send(errResponse(baseResponse.KAKAO_REFRESHTOKEN_EMPTY));
    
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
        console.log(json(error.data));
        return res.send(errResponse(json(error.data)));
      }
      return res.send(response(baseResponse.SUCCESS,kakaoProfile.data));
}

//jwt없을 때 카카오 액세스 토큰으로 정보 불러와서 로그인
exports.kakaoLogin = async function (req, res) {
    const accessToken = req.body.accessToken;
    let kakaoProfile;
    if(!accessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
	try {
        kakaoProfile = await axios({
          method: "GET",
          url: "https://kapi.kakao.com/v2/user/me",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } catch (error) {
        console.log(json(error.data));
        return res.send(errResponse(json(error.data)));
      }

      const email = kakaoProfile.data.kakao_account.email;
      const isUser = await userProvider.retrieveUserByEmail(email);
      const nickName = kakaoProfile.data.kakao_account.profile.nickname;
      const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;

      //회원이 아니라면 회원가입 과정을 거침.
      if(!isUser) {
        return res.send(response(baseResponse.USER_USER_NOT_EXIST));
      }
      //회원이라면 signIn시켜줌
      else{
        const kakaoSignInResult = await userService.postSignIn(isUser.userIdx, email);
        return res.send(kakaoSignInResult);
      }
}

exports.kakaoSignin = async function (req, res) {
  const accessToken = req.body.accessToken;
  let kakaoProfile;
  if(!accessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
try {
      kakaoProfile = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (error) {
      console.log(json(error.data));
      return res.send(errResponse(json(error.data)));
    }

    const email = kakaoProfile.data.kakao_account.email;
    const isUser = await userProvider.retrieveUserByEmail(email);
    const nickName = kakaoProfile.data.kakao_account.profile.nickname;
    const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;

    //회원이 아니라면 회원가입 과정을 거침.
    if(!isUser) {
      const signUpUserIdx = await userService.createKakaoUser(email);
      const createUserProfileInfo = await userService.createKakaoUserProfile(signUpUserIdx, nickName, userImg);
      
      if(createUserProfileInfo){
          const afterKakaoSignInResult = await userService.postSignIn(signUpUserIdx, email);
          return res.send(afterKakaoSignInResult);
      }
      else {
        return res.send(errResponse(baseResponse.KAKAO_CREATEPROFILE_FAIL));
      }
    }
    //회원이라면 signIn시켜줌
    else{
      const kakaoSignInResult = await userService.postSignIn(isUser.userIdx, email);
      return res.send(kakaoSignInResult);
    }
}



//jwt있을 때 자동 로그인
exports.check = async function (req, res) {
  const userIdResult = req.verifiedToken.userIdx;
  console.log(userIdResult);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

//카카오 유저 닉네임, 썸네일 업데이트
exports.userUpdateByKakao = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const accessToken = req.body.accessToken;
    if(!accessToken) return res.send(errResponse(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    // JWT 검증
    if (userIdFromJWT != userIdx) {
      res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    } 
    else {
      let kakaoProfile;
      try {
          kakaoProfile = await axios({
            method: "GET",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
      } catch (error) {
        console.log(json(error.data));
        return res.send(errResponse(json(error.data)));
      }
      const nickName = kakaoProfile.data.kakao_account.profile.nickname;
      const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;  
      
      const editkakaoUserInfoResult = await userService.editKakaoUser(userIdx, nickName, userImg);

      return res.send(editkakaoUserInfoResult);
    }
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

    const userIdFromJWT = req.verifiedToken.userIdx;

    const userId = req.params.userIdx;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

