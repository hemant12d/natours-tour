require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  // DB location
  // const DB = process.env.DB_LOCATION.replace('<PASSWORD>', process.env.DB_PASSWORD);

  // Make Connection to DB

  //NOTE: Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.

  // Connect with host Cluster
  // try{
  // const con = await mongoose.connect(DB);
  // console.log("connection successful");
  // }
  // catch(err){
  //     console.log(err);
  // }

  // Connect with LocalHost Compass
  try {
    const connection = await mongoose.connect(process.env.DB_LOCAL);
    console.log("connection successful");
  } catch (err) {
    console.log(err);
    console.log("Database connection Error");
    console.log(err.name, err.message);
    console.log("Server closed...!");
    process.exit(1);
  }
};

module.exports = dbConnection;
