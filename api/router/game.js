const express = require('express')
const GameRouter = express.Router()
const passport = require('passport')
const { getWords, 
    getRanks, 
    checkValid,	
    checkHistoryExists,
	insertHistory,
	updateHistory,
    getScore,
    updateUser } = require('../model/game')
const md5 = require('js-md5')

GameRouter.get('/ranks', async (req, res) => {
    // #swagger.tags = ['Game']
    // #swagger.summary = '遊戲排行榜API'
    /* #swagger.responses[200] = { schema: { data: [ { rank: 1, name: '陳小春', totalScore: 555, user_id: 1 } ]  } } */
    // https://ithelp.ithome.com.tw/questions/10069933
    const ranks = await getRanks()
    return res.status(200).json({data: ranks})
})

GameRouter.post('/check/answer', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // #swagger.tags = ['Game']
    // #swagger.summary = '確認答案API'
    /* #swagger.security = [{"bearerAuth": []}] */
    /* #swagger.parameters[答案] = { in: 'body', schema: { answer: 'poops!' } } */
    /* #swagger.responses[200] = { schema: { data: { true_index: [0 , 1, 0, 1, 0, 1], remaining_times: 4 } } } */
    /* #swagger.responses[400] = { schema: { message: '你已經破完本日關卡!' } } */
    /* #swagger.responses[400] = { schema: { message: '你已經用完本日次數!' } } */
    /* #swagger.responses[400] = { description: '提交答案格式有誤!' } */
    /* #swagger.responses[400] = { description: '不符合拼字規則!' } */
    /* #swagger.responses[401] = { description: '請重新登入!' } */

    // 表單驗證
    if(typeof(req.body.answer) === 'undefined' || req.body.answer.length !== 5) {
        return res.status(400).json({message: '提交答案格式有誤!'})
    }


    // 用日期去加密
    const date = new Date()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    const strDate = [date.getFullYear(), month, day].join("-")
    const id = md5(`${date.getFullYear()}${month}${day}`)

    const realId = parseInt(id.slice(0, 3), 16) % 2314
    
    if(checkValid(req.body.answer) === undefined) {
        return res.status(400).json({message: '不符合拼字規則!'})
    } else {
        const true_index = []
        let remaining_times = 0
        
        const words = await getWords(realId)
        const answer = req.body.answer.toLowerCase()
        for (let index = 0; index < 5; index++) {
            if(words[index] === answer[index]) {
                true_index.push(1)
            } else {
                true_index.push(0)
            }
        }

        
        // 判斷如果當天存在該筆資料，更新，不存在則插入
        const history = await checkHistoryExists(req.user.user_id, strDate)

        let score = 0
        if(true_index.find(d => d === 0) === undefined) { score = 1 }

        if(history.length !== 0) {
            if(history[0].score === 1) {
                return res.status(400).json({message: '你已經破完本日關卡!'})
            } else if(history[0].times === 6) {
                return res.status(400).json({message: '你已經用完本日次數!'})
            } else {
                updateHistory(score, history[0].times + 1, history[0].history_id)
                remaining_times = 6 - history[0].times + 1
            }
        } else {
            insertHistory(strDate, score, 1, req.user.user_id)
            remaining_times = 5
        }

        if(score === 1) {
            // 重新統計他的所有分數
            const S = await getScore(req.user.user_id)
            updateUser(S.length, req.user.user_id)
        }

        return res.status(200).json({data: { true_index: true_index,  remaining_times: remaining_times}})
    }
})


module.exports = GameRouter