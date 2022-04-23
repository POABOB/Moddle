// passport_auth.js
const passport = require('passport')
const passportJWT = require("passport-jwt")
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// Call this from app.js using passportAuth.initPassport(app)
module.exports.initPassport = function (app) {
  app.use(passport.initialize());
  
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET // Specify a JWT secret in .env file
  },
    function (jwtPayload, done) {
      // find the user in db if needed.
      // This functionality may be omitted if you store everything you'll need in JWT payload.
      return done(null, jwtPayload);
    }
  ));

  // Passport Strategy for login via email
  passport.use('local',
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false // Use JWT and not session
      },
      async (email, password, done) => {
        var user = await User.findOne(
          {
            where: { email: email },
          })
        if (!user) {
          // Username doesn't exist
          return done(null, false, { message: 'Incorrect email or password' })
        }
        if (!user.validPassword(password)) {
          // Password doesn't match
          return done(null, false, { message: 'Incorrect email or password' })
        }
        if (!user.isVerified) {
            return done(null, false, { resend_email: true, message: 'Email is not Verified' })
        }
        // Login is successful
        done(null, { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
      }
    )
  )
}

// Passport strategy for login via facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.BASE_SERVER_URL + '/api/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        console.log("Facebook authentication triggered")
        try {
          // Check if the fb profile has an email associated. Sometimes FB profiles can be created by phone
          // numbers in which case FB doesn't have an email - If email is not present, we fail the signup 
          // with the proper error message
          if (!profile._json.email) {
            return done(null, false,
              { message: 'Facebook Account is not registered with email. Please sign in using other methods' })
          }
          let data = await utils.getOrCreateNewUserWithMedium(
            accessToken,
            profile.id,
            profile._json.first_name,
            profile._json.last_name,
            profile._json.picture.data.url,
            profile._json.email,
            'facebook',
            parseInt(req.query.state)) // An optional param you can pass to the request 
          if(data.alreadyRegisteredError){
            // You can also support logging the user in and overriding the login medium
            done(null, false, {
              message: `Email is alredy registered with ${data.medium} account. Please login with email.`
            });
          } else {
            done(null, { id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName });
          }
        } catch (err) {
          return done(null, null, {message: 'Unknown error'})
        }
      });
    }
  ));
  
  // Passport strategy for login via google
    passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_SERVER_URL + '/api/google/callback',
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        try {
          // Check if the google profile has an email associated. Sometimes google profiles can be created by phone
          // numbers in which case google doesn't have an email - if email is not present, 
          // we fail the signup with the proper error message
          if (!profile._json.email) {
            return done(null, false,
              { message: 'Google Account is not registered with email. Please sign in using other methods' })
          }
          let data = await controllerUtils.getOrCreateNewUserWithMedium(
            accessToken,
            profile.id,
            profile._json.given_name,
            profile._json.family_name,
            profile._json.picture,
            profile._json.email,
            'google',
            parseInt(req.query.state))
          if(data.alreadyRegisteredError){
            done(null, false, {
              message: `Email is alredy registered with ${data.medium} account. Please login with ${data.medium} account.`
            });
          } else {
            done(null, {  id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName  });
          }
        } catch (err) {
          return done(null, null, {message: 'Unknown error'})
        }
      });
    }
));