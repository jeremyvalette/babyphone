const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
const User = require('../models/User')
const db = require('./db')

function configurePassport(passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: db.secret
  }

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    // @todo change 'id' key
    User.findOne({email: jwtPayload.email})
      .then((user) => {
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      }).catch((err) => {

      return done(err, false)
    })
  }))

}

function getToken({ authorization }) {
  return authorization
}

module.exports = {
  configurePassport,
  getToken,
}