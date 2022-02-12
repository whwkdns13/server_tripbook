module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    // 0. 테스트 API
    app.get('/app/test', user.getTest);

    

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    //카카오 로그인 이용한 로그인기능 구현

    //액세스 토큰으로 카카오 회원가입(유저 테이블) API
    app.post('/app/kakao/signup', user.kakaoSignup);

    //액세스 토큰으로 카카오 회원가입(유저프로필 테이블) API
    app.post('/app/kakao/signupProfile', user.kakaoSignupProfile);

    //액세스 토큰으로 카카오 로그인 구현 API
    app.post('/app/kakao/signin', user.kakaoSignin);

    //카카오 액세스 토큰 갱신하기 리프레시 토큰
    app.post('/app/user/kakao/updateTokens/:userIdx', user.updateKakaoTokens);
    
    //유저 닉네임, 이미지 업데이트 api(카카오 이용)
    //app.post('/app/user/kakao/updateUserProfile/:userIdx', jwtMiddleware, user.userUpdateByKakao); 
    app.post('/app/user/kakao/updateUserProfile/:userIdx', user.userUpdateByKakao);

    //리프레시 토큰으로 jwt토큰, 리프레시 토큰 갱신하기
    app.post('/app/user/updateTokens/:userIdx', jwtMiddleware, user.updateTokens);
    
    //jwt를 이용한 자동 로그인 기능 구현
    app.get('/app/autoSignin', jwtMiddleware, user.check);
};

// TODO: 탈퇴하기 API
