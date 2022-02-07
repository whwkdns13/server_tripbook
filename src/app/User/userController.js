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
     * Path Variable: userId
     */
    const userId = req.params.userId;
    // errResponse 전달
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

exports.kakaoLoginByRefresh = async function (req, res) {
    //리프레시 토큰이 있으면 카카오 서버에서 액세스 받아옴
    const kakaoRefreshToken = req.body.kakaoRefreshToken;
    if(!kakaoRefreshToken) return res.send(response(baseResponse.KAKAO_REFRESHTOKEN_EMPTY));
    
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
        return res.json(error.data);
      }
      return res.send(response(baseResponse.SUCCESS,kakaoProfile.data));
}

exports.kakaoLogin = async function (req, res) {
    const accessToken = req.body.accessToken;

    let kakaoProfile;
    if(!accessToken) return res.send(response(baseResponse.KAKAO_ACCESSTOKEN_EMPTY));
	try {
        kakaoProfile = await axios({
          method: "GET",
          url: "https://kapi.kakao.com/v2/user/me",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } catch (error) {
        return res.json(error.data);
      }//kakaoProfile.data.id
      const kakaoId = kakaoProfile.data.id;
      
      const isUser = await userProvider.selectUserKakaoId(kakaoId);
      const nickName = kakaoProfile.data.kakao_account.profile.nickname;
      const userImg = kakaoProfile.data.kakao_account.profile.thumbnail_image_url;
      //회원이 아니라면 회원가입 과정을 거침.
      if(!isUser) {
        const signUpUserIdx = await userService.createKakaoUser(kakaoId);
        const createUserProfileInfo = await userService.createKakaoUserProfile(signUpUserIdx, nickName, userImg);
        
        if(createUserProfileInfo){
            const afterKakaoSignInResult = await userService.postSignIn(signUpUserIdx, kakaoId);
            return res.send(afterKakaoSignInResult);
        }
      }
      else{
        //회원이라면 signIn시켜줌
        const kakaoSignInResult = await userService.postSignIn(isUser.userIdx, kakaoId);
        return res.send(kakaoSignInResult);
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

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};






// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
