import express from 'express'
import { customResponse, deleteData, getAllData, getSingleData, insertData, updateData } from '../utils/helper.js'
import { middlewareAuth } from '../utils/middleware.js'
import fs from 'node:fs/promises'
import CryptoJS from 'crypto-js'
import { v7 as uuid7 } from 'uuid'

const router = express.Router()

router.use(middlewareAuth)

const generateTitleImage = (id) => {
    let title_image = new Date().toString()
    title_image = CryptoJS.SHA256(`${title_image}-${id}`).toString()

    return title_image
}

router.get("/", async (req, res) => {
    const data = await getAllData("product")
    let file_data = await fs.readFile("./storage/resource.json", "utf8")
    file_data = JSON.parse(file_data)

    let db_data = data?.data

    db_data?.forEach((row) => {
        let matchData = file_data.find(data => data.title === row?.image_product)

        if (matchData) {
            row.image_product = matchData.source
        }
    })

    res.json(customResponse(200,"success",db_data))
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const result = await getSingleData("product", "id", id)

    let file_data = await fs.readFile("./storage/resource.json", "utf8")
    file_data = JSON.parse(file_data)

    let db_data = result?.data

    db_data?.forEach((row) => {
        let matchData = file_data.find(data => data.title === row?.image_product)

        if (matchData) {
            row.image_product = matchData.source
        }
    })

    res.json(customResponse("success",200,db_data))
})

router.post("/add-product", async (req, res) => {
    const data = { ...req.body }

    let id = uuid7()
    let title_image = generateTitleImage(id)

    let file_data = await fs.readFile("./storage/resource.json", "utf8")
    file_data = file_data !== "" ? JSON.parse(file_data) : []
    file_data.push({ source: data.image_product, title: title_image })

    data.image_product = title_image
    data.id = id

    const coloum = Object.keys(data)
    const value = Object.values(data)

    await insertData("product", value, coloum)
    await fs.writeFile("./storage/resource.json", JSON.stringify(file_data))

    return res.json(customResponse("success", 200))
})

router.post('/destroy/:id', async (req, res) => {
    const id = req.params.id

    const single_data_db = await getSingleData("product", "id", id)

    let file_data = await fs.readFile("./storage/resource.json", "utf8")
    file_data = file_data !== "" ? JSON.parse(file_data) : []

    file_data = file_data.filter((row) => row.title !== single_data_db.data[0].image_product)

    await deleteData("product","id",id)
    await fs.writeFile("./storage/resource.json", JSON.stringify(file_data))
    
    res.json(customResponse("success",200))
})

router.post("/update/:id", async (req, res) => {
    const id = req.params.id
    const data = req.body

    const single_data_db = await getSingleData("product", "id", id)

    let file_data = await fs.readFile("./storage/resource.json", "utf8")
    file_data = file_data !== "" ? JSON.parse(file_data) : []

    file_data[file_data.findIndex((row) => row.title === single_data_db.data[0].image_product )].source = data.image_product

    const coloum = Object.keys(data)
    const value = Object.values(data)

    await updateData("product", value, coloum, "id", id)
    await fs.writeFile("./storage/resource.json", JSON.stringify(file_data))
    res.json(customResponse("success",200))
})

export {
    router as ProductController
}
