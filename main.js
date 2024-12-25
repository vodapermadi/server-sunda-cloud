import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import { ProductController } from "./src/controller/productController.js"
import { TransactionController } from "./src/controller/transactionController.js"
import { UserController } from "./src/controller/userController.js"
import { AuthController } from "./src/controller/authController.js"
import { ManageController } from "./src/controller/manageController.js"
import { initializerDatabase } from './src/utils/connection.js'
import chalk from 'chalk'
import morgan from 'morgan'

const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))

app.use("/product",ProductController)
app.use("/transaction",TransactionController)
app.use("/user",UserController)
app.use("/auth",AuthController)
app.use("/manage",ManageController)

app.listen(PORT,async() => {
	console.log(chalk.blueBright('waiting initialitation database'))
	await initializerDatabase()
	console.log(chalk.yellow(`\nserver run in http://localhost:${PORT}\n`))
})