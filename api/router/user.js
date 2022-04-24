const express = require('express')
const UserRouter = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const { getUserInfo,
        getStatistic,
        getUserId,
        register, 
        getRank} = require('../model/user')

UserRouter.get('/info', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '使用者資訊API'
    /* #swagger.security = [{"bearerAuth": []}] */
    /* #swagger.responses[200] = { schema: { data: { name: '王小明', email: 'a@gmail.com', totalScore: 0 }} } */
    /* #swagger.responses[401] = { description: '請重新登入!' } */
    const user = await getUserInfo(req.user.user_id)
    return res.status(200).json({data: user[0]})
})


UserRouter.get('/statistic', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '使用者紀錄API'
    /* #swagger.security = [{"bearerAuth": []}] */
    /* #swagger.responses[200] = { schema: { data: [ { history_id: 1, date: '2020-05-05', score: 1, times: 1 } ], self_rank: { rank: 854, name: '王小明', totalScore: 5 } } } */
    /* #swagger.responses[401] = { description: '請重新登入!' } */
    // https://ithelp.ithome.com.tw/questions/10069933
    const history = await getStatistic(req.user.user_id)
    const rank = await getRank(req.user.user_id)

    return res.status(200).json({data: history, self_rank: rank[0]})
})

UserRouter.post('/login', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '登入API'
    /* #swagger.parameters[帳密資訊] = { in: 'body', schema: { $email: 'a@gmail.com', $password: 'a' } } */
    /* #swagger.responses[200] = { schema: { message: '登入成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '登入失敗!' } } */
    // https://code.tutsplus.com/zh-hant/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if(!user) return res.status(201).json(info)
        else return res.status(200).json({data: user, message: info})
    })(req, res)
})

UserRouter.post('/register', async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '註冊API'
    /* #swagger.parameters[註冊資訊] = { in: 'body', schema: { $email: 'a@gmail.com', $password: 'a', $name: '王小明' } } */
    /* #swagger.responses[200] = { schema: { message: '註冊成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '註冊失敗!' } } */
    // https://code.tutsplus.com/zh-hant/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
    const user = await getUserId(req.body.email, 'local')
    if(user.length !== 0) {
        return res.status(400).json({message: "該Email已存在!"})
    } else {
        const salt = bcrypt.genSaltSync(5)
        const hash = bcrypt.hashSync(req.body.password, salt)
        register(req.body.name, req.body.email, hash, 'local', 0)
        return res.status(200).json({message: "註冊成功!"})
    }
})

UserRouter.get('/logout', (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.summary = '登出API'
    /* #swagger.responses[200] = { schema: { message: '登出成功!' } } */
    /* #swagger.responses[201] = { schema: { message: '登出失敗!' } } */
    return res.status(200).json({message: "登出成功!"})
})


UserRouter.get('/google', passport.authenticate('google', { scope: ["email", "profile"], session: false })
    // #swagger.auto = false
    // #swagger.summary = 'GOOGLE登入API(直接點連結)'
    // https://ithelp.ithome.com.tw/articles/10197391
)


UserRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login.html' }), (req, res) => {
    // #swagger.auto = false
    // #swagger.summary = 'GOOGLE跳轉API(不用理他)'
    res.redirect(`/index.html?token=${req.user.token}`) 
})



UserRouter.get('/facebook', passport.authenticate('facebook', { scope : ['email'], session: false })
    // #swagger.auto = false
    // #swagger.summary = 'FB登入API(直接點連結)'
)


UserRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login.html' }), (req, res) => {
    // #swagger.auto = false
    // #swagger.summary = 'FB跳轉API(不用理他)'
    res.redirect(`/index.html?token=${req.user.token}`)
})




module.exports = UserRouter