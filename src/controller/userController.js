import express from 'express'
import { deleteData, getAllData, getSingleData, updateData } from '../utils/helper.js'
import { middlewareAuth } from '../utils/middleware.js'

const router = express.Router()

router.use(middlewareAuth)

router.get("/",async (req,res) => {
    const data = await getAllData("user")

    res.json(data.data[0])
})

router.get("/:id",async(req,res) => {
    const id = req.params.id
    const result = await getSingleData("user","id",id)

    res.json(result)
})

router.post('/destroy/:id',async(req,res) => {
    const id = req.params.id
    const result = await deleteData("user","id",id)

    res.json(result)
})

router.post("/update/:id",async(req,res) => {
    const id = req.params.id
    const data = req.body()
    const coloum = Object.keys(data)
    const value = Object.values(data)
    const result = await updateData("user",value,coloum,"id",id)

    res.json(result)
})

export {
    router as UserController
}