const AppError = require('../../utils/AppError');
require('dotenv').config();

const developmentError = (res, error) => {
    return res.status(error.statusCode).json({
        status: error.statusResult,
        msg: error.message,
        Errorstack: error.stack,
        Error: error
    });
}

const productionError = (res, error) => {

    if (error.IsOperational) {
        return res.status(error.statusCode).json({
            status: error.statusResult,
            msg: error.message,
        });
    }
    else {

        // Mongoose error also include in programming error so we have to handle them manually :) 
        console.log("Error 🦀🦀", error);
        return res.status(500).json({
            status: error.statusResult,
            msg: "Something went very very wrong !",
        });
    }

}

const productionCastError = (res, error) => {
    const msg = `Invalid ${error.path} for ${error.value}`;
    return new AppError(msg, 400);
}

const productionValidationError = (res, error) => {
    const collectionOfError = Object.values(error.errors).map(el => el.message);
    const msg = collectionOfError;
    return new AppError(msg, 404);
}

const productionDuplicateError = (res, error) => {
    console.log("Error ", error)
    const msg = `Duplicate entry for ${error.keyValue.email}`;
    return new AppError(msg, 400);
}

// JWT authentication error 🦓🦓
const jsonWebTokenError = () => new AppError('Invalid Signature of Token', 404);

// Jwt Token Expires
const tokenExpiredError = () => new AppError('Token has expired', 404);


// Handle all the programming & unexpected error
module.exports = (error, req, res, next) => {

    // newError is not referenced data type
    let newError = error;

    error.statusCode = error.statusCode || 500;
    error.statusResult = error.statusResult || 'error';

    if (process.env.NODE_ENV === 'development')
        developmentError(res, error);
    
    else if (process.env.NODE_ENV === 'production') {

        if (error.name === 'CastError')
            newError = productionCastError(res, newError);

        else if (error.name === 'ValidationError')
            newError = productionValidationError(res, newError);

        else if (error.code === 11000)
            newError = productionDuplicateError(res, newError);

        else if (error.name === 'JsonWebTokenError')
            newError = jsonWebTokenError();

        else if (error.name === 'TokenExpiredError')
            newError = tokenExpiredError();

        productionError(res, newError);

    }

}