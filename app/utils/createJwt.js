const jwt = require('jsonwebtoken');
const createJwt = id =>{
    return jwt.sign({id}, process.env.APP_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});
}

module.exports = createJwt;