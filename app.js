require('dotenv').config();
const fs = require('fs');
// Turn on production
// process.on('uncaughtException', err =>{
//     console.log(err)
//     console.log("UNCAUGHT EXCEPTION. Shuting down server...");
//     console.log(err.name, err.message);
//     process.exit(1);
// });

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Security packages
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const limiter = require("./app/utils/limiterConfiguration");

const unHandleRoute = require("./app/utils/unHandleRoute");

// Swagger docs
const swaggerUi = require('swagger-ui-express');
let swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));
// const swaggerDocument = require('./swagger.json');

// Template engine configuration
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(
    helmet(), // Set security http headers
    express.json({ limit: '10kb' }), // Limit the request parameter size from a particular IP
    hpp(), // Avoid parameter pollution
    express.urlencoded({ extended: false }),
    mongoSanitize(), // Datasanitization against NoSql Query injection
    xss(), // Data sanitization againt XSS attack
    compression()
);


// Limiting the request from particular Ip
app.use('/', limiter);

app.get("/",(req,res)=>{
    res.sendFile('index.html');
  });

// Handle all the operation & programming error
const global_Error_Handling_Middleware = require('./app/http/controllers/errorController');

const router = require('./routes/web');
const tourRoute = require('./routes/tour');
const userRoute = require('./routes/user');
const reviewRoute = require('./routes/review');
const bookingRoute = require('./routes/booking');

app.get('/success', (req, res, next)=>{
    return res.status(200).json({
        status: 'success',
        payment_status: 'paid'
    })
})
app.use(router);
app.use('/tours', tourRoute);
app.use('/users', userRoute);
app.use('/reviews', reviewRoute);
app.use('/booking', bookingRoute);

// Swagger json doc demo
// https://github.com/heldersepu/Swagger-Net-Test/blob/master/swagger.json 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Handle undefined route
app.all('*', unHandleRoute);

// Global Error handling middleware function(Out of the box!, thanks express :) 
app.use(global_Error_Handling_Middleware);

module.exports = app;