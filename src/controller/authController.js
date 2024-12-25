import express from 'express'
import { customResponse, encodeJwt, getAllData, insertData } from '../utils/helper.js'
import { connection } from '../utils/connection.js'
import { v7 as uuid7 } from 'uuid'

const router = express.Router()

router.post("/register",async(req,res) => {
    const data = req.body

    const user = await getAllData("user")

    if(user.data.filter((row) => row.email === data.email).length >= 1 ){
        return res.json(customResponse("email is exist",403))
    }

    data.id = uuid7().toString()
    const coloum = Object.keys(data)
    const value = Object.values(data)

    await insertData("user",value,coloum)
    
    return res.json(customResponse("success",200))
})

router.post("/login",async(req,res) => {
    const data = req.body

    try {
        const user = await connection.promise().query(
            'SELECT * FROM user WHERE email = ? AND password = ?',[data.email,data.password]
        )

        res.json(customResponse("success",200,encodeJwt({"id":user[0][0].id})))
    } catch (error) {
        res.json(customResponse("failed",500,error))
    }
})

export {
    router as AuthController
}
