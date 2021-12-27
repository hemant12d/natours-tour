// There are we dealing with two types of error 
// 1) One is operational error
// 2) One is programming error

                                        // Error
//        __________________________________|____________________________________
//       |                                                                      |
//   Operational                                                            Programming Error
//      
// 
// 
// 

class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.statusResult = `${this.statusCode}`.startsWith('4') ? 'fail':'error';
        this.IsOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;