import express from 'express'
import { getAllData, getSingleData, insertData, updateData } from '../utils/helper.js'
import { middlewareAuth } from '../utils/middleware.js'
import { v7 as uuid7 } from 'uuid'

const router = express.Router()
router.use(middlewareAuth)

router.get("/",async (req,res) => {
    const data = await getAllData("complaint")

    res.json(data.data[0])
})

router.get("/{id}",async(req,res) => {
    const id = req.params.id
    const result = await getSingleData("complaint","id",id)

    res.json(result)
})

router.post("/insert",async (req,res) => {
    const data = req.body
    
    const coloum = Object.keys(data)
    const value = Object.values(data)
    
    data.id = uuid7().toString()
    
    await insertData("complaint",value,coloum)
    return res.json(customResponse("success", 200))
})

router.post("/update/{id}",async(req,res) => {
    const id = req.params.id
    const data = req.body
    
    const coloum = Object.keys(data)
    const value = Object.values(data)
    
    await updateData("complaint",value,coloum,"id",id)

    return res.json(customResponse("success", 200))
})

export {
    router as ComplaintController
}