const express = require('express')
const GameRouter = express.Router()

GameRouter.get('/ranks', (req, res) => {
    // #swagger.tags = ['Game']
    // #swagger.summary = '遊戲排行榜API'
    /* #swagger.responses[200] = { schema: { data: [ { rank: 1, name: '陳小春', totalScore: 555 } ]  } } */
    // https://ithelp.ithome.com.tw/questions/10069933
    res.send(`Hello World ${process.env.NODE_ENV}`)
})

GameRouter.post('/check/answer', (req, res) => {
    // #swagger.tags = ['Game']
    // #swagger.summary = '確認答案API'
    /* #swagger.security = [{"apiKeyAuth": []}] */
    /* #swagger.parameters[答案] = { in: 'body', schema: { user_id: 1, answer: 'poops!' } } */
    /* #swagger.responses[200] = { schema: { data: { true_index: [0 , 1, 0, 1, 0, 1], remaining_times: 4 } } } */
    /* #swagger.responses[201] = { schema: { message: '今天已超過提交次數!' } } */
    /* #swagger.responses[403] = { description: '請重新登入!' } */
    res.send(`Hello World ${process.env.NODE_ENV}`)
})


module.exports = GameRouter