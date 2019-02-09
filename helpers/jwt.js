const jwt = require ('jsonwebtoken');

var config = require ('../config.js');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, config.jwtKey, { expiresIn : '12h' })
    }
}