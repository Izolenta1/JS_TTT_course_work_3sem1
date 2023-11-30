import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config()

// Инициализируем пул подключений, для выполнеия запросов к базе данных
const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DATABASE
}).promise();

// Проверка взятого соединения
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
            logger.error("Database connection was closed.", true)
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
            logger.error("Database has too many connections.", true)
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
            logger.error("Database connection was refused.", true)
        }
    }
    if (connection) connection.release()
    return
})
export default pool