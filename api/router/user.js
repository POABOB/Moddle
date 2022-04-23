const express = require('express')
const UserRouter = express.Router()

UserRouter.get('/info', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '使用者資訊API'
    /* #swagger.security = [{"apiKeyAuth": []}] */
    /* #swagger.responses[200] = { schema: { data: { name: '王小明', email: 'a@gmail.com', totalScore: 0 }} } */
    /* #swagger.responses[403] = { description: '請重新登入!' } */
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.get('/statistic', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '使用者紀錄API'
    /* #swagger.security = [{"apiKeyAuth": []}] */
    /* #swagger.responses[200] = { schema: { data: [ { history_id: 1, date: '2020-05-05', score: 1, times: 1 } ], self_rank: { rank: 854, name: '王小明', totalScore: 5 } } } */
    /* #swagger.responses[403] = { description: '請重新登入!' } */
    // https://ithelp.ithome.com.tw/questions/10069933
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.post('/login', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '登入API'
    /* #swagger.parameters[帳密資訊] = { in: 'body', schema: { $email: 'a@gmail.com', $password: 'a' } } */
    /* #swagger.responses[200] = { schema: { message: '登入成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '登入失敗!' } } */
    res.send(`Hello World ${process.env.NODE_ENV}`)
})

UserRouter.post('/register', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '註冊API'
    /* #swagger.parameters[註冊資訊] = { in: 'body', schema: { $email: 'a@gmail.com', $password: 'a', $name: '王小明' } } */
    /* #swagger.responses[200] = { schema: { message: '註冊成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '註冊失敗!' } } */
    res.send(`Hello World ${process.env.NODE_ENV}`)
})

UserRouter.get('/logout', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '登出API'
    /* #swagger.responses[200] = { schema: { message: '登出成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '登出失敗!' } } */
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.get('/google', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = 'GOOGLE登入API(直接點連結)'
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.get('/google/callback', (req, res) => {
    // #swagger.auto = false
    // #swagger.summary = 'GOOGLE跳轉API(不用理他)'
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.get('/facebook', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = 'FB登入API(直接點連結)'
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


UserRouter.get('/facebook/callback', (req, res) => {
    // #swagger.auto = false
    // #swagger.summary = 'FB跳轉API(不用理他)'
    res.send(`Hello World ${process.env.NODE_ENV}`)
})




module.exports = UserRouter