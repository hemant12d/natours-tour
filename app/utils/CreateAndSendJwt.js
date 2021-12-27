const createJwt = require('./createJwt');
module.exports = (user, statusCode, res) => {
    const jwtToken = createJwt(user._id);

    let cookieOptions = {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 90)), // Time in milisecond
        httpOnly: true
    }

    // Enable when you host site
    // if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', jwtToken, cookieOptions);
    user.password = undefined;

    return res.status(statusCode).json({
        status: 'success',
        token: jwtToken,
        data: { user: user }
    });

}