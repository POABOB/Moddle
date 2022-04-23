const express = require('express')
const app = express()
require('dotenv').config()

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json') // 剛剛輸出的 JSON
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


const UserRouter = require('./router/user')
const GameRouter = require('./router/game')
app.use('/api/user', UserRouter)
app.use('/api/game', GameRouter)

app.listen(process.env.PORT)