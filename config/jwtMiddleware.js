const jwt = require('jsonwebtoken');
const secret_config = require('./secret');
const { response } = require("./response")
const { errResponse } = require("./response")
const baseResponse = require("./baseResponseStatus");
const userProvider = require("../src/app/User/userProvider");
const userService = require("../src/app/User/userService");

//토큰 유효성 검증
const jwtMiddleware = (req, res, next) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.body.refreshToken;
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
        if(error.name === 'TokenExpiredError') return res.send(errResponse(baseResponse.TOKEN_TOKEN_EXPIRED));
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    };

    // process the promise
    p.then(async (verifiedToken)=>{
        if(token === req.headers['x-access-token']){
            //jwt Token은 한명당 한개만 배정되어 있음.
            const accessTokenFromDB = await userProvider.retrieveAccessToken(verifiedToken.userIdx);
            //retrieveAccessToken
            if(token === accessTokenFromDB) {
                req.verifiedToken = verifiedToken;
                next();
            }
            else
                return res.send(errResponse(baseResponse.TOKEN_JWTTOKEN_NOT_MATCH));
        }
        else if(token === req.body.refreshToken){
            req.verifiedToken = verifiedToken;
            next();
        }
        else{
            return res.send(errResponse(baseResponse.TOKEN_EMPTY));
        }
    }).catch(onError)
};

module.exports = jwtMiddleware;
