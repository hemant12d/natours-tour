
/**
 * Insert this Errsole code snippet as the first line of your app's main file
 */
const errsole = require('@errsole/node');
errsole.initialize({
    framework: 'express',
    token: 'd3cb01ff-3d60-4f06-aa09-e5b54911ee9f',
    exitOnException: true,
    evalExpression: true,
});
// End of Errsole code snippet

const DB = require('./DB'); DB(); // Database Connection

const app = require('./app') // Express App

const PORT = (process.env.APP_PORT * 1) || 5000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT} : true`) }); 

// The process is the global object in Node.js that keeps track of and contains all the information of the particular node.js process that is executing at a particular time on the machine.

// The unhandledRejection event is emitted whenever a promise rejection is not handled. NodeJS warns the console about UnhandledPromiseRejectionWarning and immediately terminates the process. The NodeJS process global has an unhandledRejection event. This event is fire when unhandledRejection occurs and no handler to handle it in the promise chain. 

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {   
      process.exit(1);
    });
});

// process.on('uncaughtException', err =>{
//     console.log(err)
//     console.log("UNCAUGHT EXCEPTION. Shutting down server...");
//     console.log(err.name, err.message);
//     process.exit(1);
// });

  
