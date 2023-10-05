import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT
});

pool.getConnection().then( (res) =>
    console.log("bien connecté à la BDD --> "+res.config.database)
);

export default pool;