import chalk from 'chalk'
import mysql from 'mysql2'

const connection = mysql.createPool({
    password: process.env.PASSWORD_DB,
    host: process.env.HOST,
    user: process.env.USERNAME_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const initializerDatabase = async () => {
    try {
        const databaseName = process.env.DATABASE

        if (!databaseName) {
            throw new Error('DATABASE environment variable is not set')
        }

        await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`)

        await connection.promise().query(`USE \`${databaseName}\`;`)

        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS user (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') NOT NULL
            );
        `)

        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS product (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                list TEXT,
                image_product VARCHAR(255),
                price FLOAT NOT NULL
            );
        `)

        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS transaction (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                transaction_id VARCHAR(255) NOT NULL,
                status ENUM('pending', 'waiting', 'clear') NOT NULL,
                amount INT NOT NULL,
                price FLOAT NOT NULL,
                total FLOAT NOT NULL,
                user_id VARCHAR(255)
            );
        `)

        console.log(chalk.greenBright('Database and tables initialized successfully'))
    } catch (error) {
        console.log(chalk.redBright(`Error during database initialization: ${error.message}`))
        process.exit(1)
    }
}

export {
    connection,
    initializerDatabase
}
