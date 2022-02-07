const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
  },
  console.log("You are now connected to the company database")
);

module.exports = db;
