// passport_auth.js
const passport = require('passport')
const passportJWT = require("passport-jwt")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { getUser, register } = require('../model/user')

// JWT查驗
passport.use('jwt', new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET 
    }, 
    (jwtPayload, done) => { return done(null, jwtPayload) }
  )
)


// 登入
passport.use('login', new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      // TODO 資料庫查找 USER
      let user = await getUser(email, 'local')

      if(user.length === 0) { return done(null, false, { message: '帳號或密碼錯誤!' }) }
      user = user[0]
      const match = await bcrypt.compare(password, user.password)

      if(match) {
        user.password = ''
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
        return done(null, { id: user.id, name: user.name, email: user.email, token: token }, '登入成功!')
      } else {
        return done(null, false, { message: '帳號或密碼錯誤!' })
      }
    }
  )
)


// GOOGLE
// https://console.cloud.google.com/apis/credentials?highlightClient=658030142079-sv8toegeud1sfe2eem0ong3bg89i42hp.apps.googleusercontent.com&project=nodal-almanac-245903
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/user/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await getUser(profile._json.email, 'google');
      let token = ''
      if (user.length !== 0) {
        // 如果有USER，返回JWT token
        user.password = ''
        token = jwt.sign(JSON.stringify(user[0]), process.env.JWT_SECRET)
      } else {
        // 如果沒有USER，註冊，返回JWT token
        const R = await register(profile._json.family_name + ' '+ profile._json.given_name, profile._json.email, profile._json.id, 'google', 0)
        user = {
          user_id: R.id,
          name: profile._json.family_name + ' '+ profile._json.given_name,
          email: profile._json.email
        }
        token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
        
      }
      return done(null, { id: user.id, name: user.name, email: user.email, token: token });
    } catch (err) {
      return done(err, false)
    }
  }
))

// FB
// https://developers.facebook.com/docs/facebook-login/
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/user/facebook/callback',
    profileFields: ['id', 'emails', 'name'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await getUser(profile._json.email, 'facebook');
      let token = ''
      if (user.length !== 0) {
        // 如果有USER，返回JWT token
        user.password = ''
        token = jwt.sign(JSON.stringify(user[0]), process.env.JWT_SECRET)
      } else {
        // 如果沒有USER，註冊，返回JWT token
        const R = await register(profile._json.last_name + ' '+ profile._json.first_name, profile._json.email, profile._json.id, 'facebook', 0)
        user = {
          user_id: R.id,
          name: profile._json.last_name + ' '+ profile._json.first_name,
          email: profile._json.email
        }
        token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
        
      }
      return done(null, { id: user.id, name: user.name, email: user.email, token: token });
    } catch (err) {
      return done(err, false)
    }
  }
))
  


