require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  // DB location
  // const DB = process.env.DB_LOCATION.replace('<PASSWORD>', process.env.DB_PASSWORD);

  // Make Connection to DB

  //NOTE: Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.

  // Connect with LocalHost Compass
  try {
    const connection = await mongoose.connect(process.env.DB_LOCAL);
    console.log("Database connection : true");
  } catch (err) {
    console.log(err);
    console.log(err.name, err.message);
    console.log("Database error : true");
    console.log("Server exit : true");
    process.exit(1);
  }
};

module.exports = dbConnection;
