const mysql = require('mysql2/promise')
require('dotenv').config()

// conection
const connection = mysql.createPool({
    host: process.env.HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE
})

module.exports = connection