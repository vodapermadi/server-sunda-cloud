import { connection } from "./connection.js"
import jwt from "jsonwebtoken"

const customResponse = (message, statusCode, data = null) => {
    return {
        message: message,
        statusCode: statusCode,
        data: data === null ? [] : data
    }
}

const getAllData = async (table) => {
    try {
        const data = await connection.promise().query(
            `SELECT * FROM ${table}`
        )
        return customResponse("success", 200, data[0])
    } catch (error) {
        return customResponse("failed", 500, error.sqlMessage)
    }
}

const getSingleData = async (table, id_name, id_value) => {
    try {
        const data = await connection.promise().query(
            `SELECT * FROM ${table} WHERE ${id_name} = '${id_value}'`
        )
        return customResponse("success", 200, data[0])
    } catch (error) {
        return customResponse("failed", 500, error.sqlMessage)
    }
}

const insertData = async (table, value, coloum) => {
    try {
        const data = await connection.promise().query(
            `INSERT into ${table} (${coloum.join(",")}) VALUES (${value.map(row => `'${row}'`).join(",")})`
        )

        return customResponse("success", 200, data)
    } catch (error) {
        return customResponse("failed", 500, error)
    }
}

const deleteData = async (table, id_name, id_value) => {
    try {
        const data = await connection.promise().query(
            `DELETE FROM ${table} WHERE ${id_name} = '${id_value}'`
        )
        return customResponse("success", 200, data[0])
    } catch (error) {
        return customResponse("failed", 500, error.sqlMessage)
    }
}

const updateData = async (table, value, coloum, id_name, id_value) => {
    try {
        let query = `UPDATE ${table} set ${coloum.map((row, i) => `${row} = '${value[i]}'`).join(",")} WHERE ${id_name} = '${id_value}'`
        const data = await connection.promise().query(query)
        return customResponse("success", 200, data)
    } catch (error) {
        return customResponse("failed", 500, error.sqlMessage)
    }
}

const encodeJwt = (data) => {
    const token = jwt.sign(data, process.env.SECRET_KEY, {
        algorithm: "HS384",
        expiresIn: "1d"
    })

    return token
}

const decodeJwt = (token) => {
    const translate = jwt.verify(token, process.env.SECRET_KEY,{
	algorithms:['HS384']
    })
    return translate
}

export {
    getAllData,
    getSingleData,
    customResponse,
    insertData,
    deleteData,
    updateData,
    decodeJwt,
    encodeJwt,
}
