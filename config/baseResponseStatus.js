//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS: { "isSuccess": true, "code": 1000, "message": "성공" },
    TOKEN_JWTVERIFICATION_SUCCESS: { "isSuccess": true, "code": 1001, "message": "JWT 토큰 검증 성공" },
    TOKEN_ACCESSTOKEN_UPDATE: { "isSuccess": true, "code": 1002, "message": "JWT 토큰 업데이트 성공" },
    USER_USER_LOGOUT_SUCCESS:{ "isSuccess": true, "code": 1003, "message": "비정상적인 접속으로 인해 로그아웃 되었습니다." },
    SIGNUP_USER_SUCCESS:{ "isSuccess": true, "code": 1004, "message": "유저테이블 생성 성공. 유저 프로필도 생성해주세요." },
    SIGNUP_USERPROFILE_SUCCESS:{ "isSuccess": true, "code": 1005, "message": "회원가입 성공" },

    // Common

    //TOKEN error 1500~2000
    TOKEN_EMPTY: { "isSuccess": false, "code": 1500, "message": "JWT 토큰을 입력해주세요." },
    TOKEN_REFRESHTOKEN_EMPTY: { "isSuccess": false, "code": 1501, "message": "refresh 토큰을 입력해주세요." },
    TOKEN_REFRESHTOKEN_EXPIRED: { "isSuccess": false, "code": 1502, "message": "REFRESH 토큰 만료" },
    TOKEN_JWTTOKEN_EXPIRED: { "isSuccess": false, "code": 1503, "message": "JWT 토큰 만료" },
    TOKEN_VERIFICATION_FAILURE: { "isSuccess": false, "code": 1504, "message": "토큰 검증 실패" },
    TOKEN_REFRESHTOKEN_NOT_MATCH:{ "isSuccess": false, "code": 1505, "message": "refersh 토큰이 DB와 다릅니다. 카카오 액세스 토큰으로 재 로그인 해 주세요." },
    TOKEN_TOKEN_NOT_EXPIRED:{ "isSuccess": false, "code": 1506, "message": "jwt토큰의 유효기간이 아직 지나지 않아 보안 이슈로 토큰들이 만료됩니다." },
    TOKEN_JWTTOKEN_NOT_MATCH:{ "isSuccess": false, "code": 1507, "message": "access 토큰이 DB와 다릅니다." },
    TOKEN_TOKEN_NOT_MATCH:{ "isSuccess": false, "code": 1508, "message": "jwt 토큰이 DB와 다릅니다." },
    TOKEN_TOKEN_EXPIRED: { "isSuccess": false, "code": 1509, "message": "토큰 만료" },
    //Request error
    SIGNUP_EMAIL_EMPTY: { "isSuccess": false, "code": 2001, "message": "이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH: { "isSuccess": false, "code": 2002, "message": "이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE: { "isSuccess": false, "code": 2003, "message": "이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY: { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH: { "isSuccess": false, "code": 2005, "message": "비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY: { "isSuccess": false, "code": 2006, "message": "닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH: { "isSuccess": false, "code": 2007, "message": "닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY: { "isSuccess": false, "code": 2008, "message": "이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH: { "isSuccess": false, "code": 2009, "message": "이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE: { "isSuccess": false, "code": 2010, "message": "이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY: { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },


    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2012, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_IDX_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    KAKAO_ACCESSTOKEN_EMPTY : {"isSuccess": false, "code": 2050, "message": "kakao accesstoken을 입력해주세요"},
    KAKAO_REFRESHTOKEN_EMPTY :{"isSuccess": false, "code": 2051, "message": "kakao refreshtoken을 입력해주세요"},
    USER_USER_NOT_EXIST : {"isSuccess": false, "code": 2052, "message": "회원 가입이 필요합니다."},
    KAKAO_REFRESHTOKEN_NOT_MATCH:{"isSuccess": false, "code": 2053, "message": "kakao refreshToken이 사용자의 것이 아닙니다."},
    KAKAO_REFRESHTOKEN_NOT_EXIST:{"isSuccess": false, "code": 2054, "message": "DB에 kakao refreshToken이 없습니다. 카카오 로그인을 진행해주세요."},
    USER_USER_EXIST : {"isSuccess": false, "code": 2055, "message": "이미 있는 회원입니다."},
    USER_USERPROFILE_EXIST : {"isSuccess": false, "code": 2056, "message": "이미 프로필이 있는 회원입니다."},
    KAKAO_KAKAO_ERROR:{"isSuccess": false, "code": 2057, "message": "카카오 서버에 요청이 실패했습니다."},
    
    
    // trip req error 2200~2299
    TRIP_TRIPIDX_EMPTY: { "isSuccess": false, "code": 2100, "message": "tripIdx를 입력해주세요" },
    TRIP_TRIPTITLE_EMPTY: { "isSuccess": false, "code": 2101, "message": "tripTitle를 입력해주세요" },
    TRIP_DEPARTUREDATE_EMPTY: { "isSuccess": false, "code": 2102, "message": "departureDate를 입력해주세요" },
    TRIP_ARRIVALDATE_EMPTY: { "isSuccess": false, "code": 2103, "message": "arrivalDate를 입력해주세요" },
    TRIP_THEMEIDX_EMPTY: { "isSuccess": false, "code": 2104, "message": "themeIdx를 입력해주세요" },
    TRIP_USERIDX_EMPTY: { "isSuccess": false, "code": 2105, "message": "userIdx를 입력해주세요" },
    TRIP_USERIDX_NOT_EXIST: { "isSuccess": false, "code": 2106, "message": "해당 userIdx가 존재하지 않습니다." },
    TRIP_TRIPTITLE_LENGTH: { "isSuccess": false, "code": 2107, "message": "tripTitle은 14자리 이하로 입력해주세요" },
    TRIP_LATEST_NOT_EXIST: { "isSuccess": false, "code": 2107, "message": "latestTrip이 존재하지 않습니다." },
    TRIP_COURSE_NOT_EXIST: { "isSuccess": false, "code": 2108, "message": "course가 존재하지 않습니다." },
    TRIP_DELETE_TRIP: { "isSuccess": false, "code": 2109, "message": "삭제 된 여행입니다." },
    TRIP_NOT_EXIST: { "isSuccess": false, "code": 2110, "message": "해당 tripIdx를 가진 여행이 존재하지 않습니다." },
    TRIP_TRIPUSER_NOT_MATCH: { "isSuccess": false, "code": 2111, "message": "해당 여행이 user의 것이 아닙니다." },

    // course req error 2200~2299
    COURSE_COURSEIDX_EMPTY: { "isSuccess": false, "code": 2200, "message": "courseIdx를 입력해주세요." },
    COURSE_TRIPIDX_EMPTY: { "isSuccess": false, "code": 2201, "message": "tripIdx를 입력해주세요." },
    COURSE_COURSEDATE_EMPTY: { "isSuccess": false, "code": 2202, "message": "날짜(date)를 입력해주세요." },
    COURSE_COURSETIME_EMPTY: { "isSuccess": false, "code": 2203, "message": "시간(time)을 입력해주세요." },
    COURSE_COURSETITLE_EMPTY: { "isSuccess": false, "code": 2204, "message": "제목을 입력해주세요." },
    COURSE_COURSEIMAGE_EMPTY: { "isSuccess": false, "code": 2205, "message": "이미지를 입력해주세요." },
    COURSE_COURSECOMMENT_EMPTY: { "isSuccess": false, "code": 2206, "message": "코멘트를 입력해주세요." },
    TRIPIMG_TRIPIDX_EMPTY: { "isSuccess": false, "code": 2207, "message": "tripIdx를 입력해주세요." },
    TRIPIMG_TRIPIMG_EMPTY: { "isSuccess": false, "code": 2208, "message": "tripImg를 입력해주세요." },
    TRIPIMG_IDX_NOT_MATCH: { "isSuccess": false, "code": 2209, "message": "tripidx 값을 확인해주세요" },
    COURSE_USERIDX_EMPTY: { "isSuccess": false, "code": 2210, "message": "userIdx를 입력해주세요" },
    COURSE_CARDIDX_EMPTY: { "isSuccess": false, "code": 2211, "message": "cardIdx를 입력해주세요" },
    COURSE_COURSEIDX_NOT_EXIST: { "isSuccess": false, "code": 2212, "message": "해당 courseIdx를 가진 발자국이 존재하지 않습니다." },
    COURSE_HASHTAGIDX_EMPTY: { "isSuccess": false, "code": 2213, "message": "hashTagIdx를 입력해주세요" },
    COURSE_REGION1_EMPTY :    { "isSuccess": false, "code": 2214, "message": "region1를 입력해주세요" },
    COURSE_REGION2_EMPTY :    { "isSuccess": false, "code": 2215, "message": "region2를 입력해주세요" },
    COURSE_COURSE_NOT_EXIST :{ "isSuccess": false, "code": 2216, "message": "해당 courseIdx를 가진 코스가 존재하지 않습니다." },
    COURSE_COURSEUSER_NOT_MATCH:{ "isSuccess": false, "code": 2217, "message": "해당 발자국이 user의 것이 아닙니다." },
    COURSE_REGION3_EMPTY :    { "isSuccess": false, "code": 2218, "message": "region3를 입력해주세요" },
    COURSE_COURSETITLE_LENGTH :    { "isSuccess": false, "code": 2219, "message": "제목을 길이에 맞게 입력해주세요" },
    COURSE_COURSECOMMENT_LENGTH :    { "isSuccess": false, "code": 2220, "message": "코멘트를 길이에 맞게 입력해주세요" },
    COURSE_region_LENGTH:    { "isSuccess": false, "code": 2221, "message": "region1, 2, 3을 길이에 맞게 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL: { "isSuccess": false, "code": 3001, "message": "중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME: { "isSuccess": false, "code": 3002, "message": "중복된 닉네임입니다." },
    USER_USER_LOGOUT:{ "isSuccess": false, "code": 3007, "message": "로그아웃된 유저입니다." },
    SIGNIN_EMAIL_WRONG: { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG: { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_DELETED_ACCOUNT: { "isSuccess": false, "code": 3005, "message": "삭제 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT: { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR: { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러" },
    SERVER_ERROR: { "isSuccess": false, "code": 4001, "message": "서버 에러" },
}
