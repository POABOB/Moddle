const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json') // 剛剛輸出的 JSON
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const passport = require('passport')
require('./middleware/passport')
app.use(passport.initialize())

const UserRouter = require('./router/user')
const GameRouter = require('./router/game')
app.use('/api/user', UserRouter)
app.use('/api/game', GameRouter)
app.use('/', express.static(path.join(__dirname, '../static')))

app.listen(process.env.PORT)