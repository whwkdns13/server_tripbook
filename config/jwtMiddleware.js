const jwt = require('jsonwebtoken');
const secret_config = require('./secret');
const { response } = require("./response")
const { errResponse } = require("./response")
const baseResponse = require("./baseResponseStatus");

//토큰 유효성 검증
const jwtMiddleware = (req, res, next) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token;
    // token does not exist
    if(!token) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY))
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) {
                    reject(err);
                }
                resolve(verifiedToken)
            })
        }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        if(error.name === 'TokenExpiredError') return res.send(errResponse(baseResponse.TOKEN_JWTTOKEN_EXPIRED));
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    };

    // process the promise
    p.then((verifiedToken)=>{
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

//리프레시 토큰으로 갱신 시 액세스 토큰 검증
const accessMiddleware = (req, res, next) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token;
    // token does not exist
    if(!token) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY))
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) {
                    reject(err);
                }
                resolve(verifiedToken)
            })
        }
    );

    // 액세스 토큰 유효기간 만료의 경우는 넘어가준다
    const onError = (error) => {
        if(error.name !== 'TokenExpiredError') 
            return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
        else {
            req.jwtExpired = true;
            next();
        }
    };
    // process the promise
    p.then((verifiedToken)=>{
        //액세스 토큰 유효기간이 남아있는 데도 재발급 받으려 하면 모두 만료시킨다.
        req.jwtExpired = false;
        next();
    }).catch(onError);
};

const refreshMiddleware = (req, res, next) => {
    
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        return res.send(errResponse(baseResponse.TOKEN_REFRESHTOKEN_EMPTY));
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(refreshToken, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) {
                    reject(err);
                }
                resolve(verifiedToken)
            })
        }
    );

    // 액세스 토큰 유효기간 만료의 경우는 넘어가준다
    const onError = (error) => {
        if(error.name !== 'TokenExpiredError') 
            return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
        else return res.send(errResponse(baseResponse.TOKEN_JWTTOKEN_EXPIRED));
    };
    // process the promise
    p.then((verifiedToken)=>{
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError);
};

module.exports = {jwtMiddleware, accessMiddleware, refreshMiddleware};
