module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest);

    

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);


    // 아래 부분은 7주차에서 다룸.
    

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    //액세스 토큰으로 카카오 로그인 구현 API
    app.post('/app/kakao/login', user.kakaoLogin);

    //리프레시 토큰으로 카카오 로그인 API
    app.post('/app/kakao/login/refresh', user.kakaoLoginByRefresh);
    
    app.get('/app/auto-login', jwtMiddleware, user.check);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API


// TODO: 탈퇴하기 API
