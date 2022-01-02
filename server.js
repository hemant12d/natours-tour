require('dotenv').config();

// Turn on production
// process.on('uncaughtException', err =>{
//     console.log(err)
//     console.log("UNCAUGHT EXCEPTION. Shuting down server...");
//     console.log(err.name, err.message);
//     process.exit(1);
// });

const express = require('express');
const app = express();
const DB = require('./DB'); DB(); // Database Connection
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const limiter = rateLimit(
    {
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, Please try after one hour !"
    }
);

// Set security http headers
app.use(helmet());

// Limit the request parameter size from a particular IP
app.use(express.json({ limit: '10kb' }));

app.use(hpp());
app.use(express.urlencoded({ extended: false }));

// Datasanitization against NoSql Query injection
app.use(mongoSanitize());

// Data sanitization againt XSS attack
app.use(xss());

// Limiting the request from particular Ip
app.use('/', limiter);

// Handle all the operational error
const AppError = require('./app/utils/AppError');

// Handle all the operation & programming error
const global_Error_Handling_Middleware = require('./app/http/controllers/errorController');

const router = require('./routes/web');
const tourRoute = require('./routes/tour');
const userRoute = require('./routes/user');
const reviewRoute = require('./routes/review');

app.use(router);
app.use('/tours', tourRoute);
app.use('/users', userRoute);
app.use('/reviews', reviewRoute);


// Handle undefined route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the route ${req.originalUrl}`, 404));
});

// Global Error handling middleware function(Out of the box!, thanks express :) ) 
app.use(global_Error_Handling_Middleware);

const port = 8000;

app.listen(port, () => { console.log(`Server running on port`) });