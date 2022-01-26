const DB = require('./DB'); DB(); // Database Connection

const app = require('./app') // Express App

app.listen((process.env.APP_PORT * 1), () => { console.log(`Server running on port`) }); // Serverlisting with port
