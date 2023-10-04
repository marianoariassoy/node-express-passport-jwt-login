import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import { usersModel } from '../model/users.model.js'
import { createHash, isValidatePassword } from '../utils.js'

// Config
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = req => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['jwt-cookie']
  }
  return token
}

const initializePassport = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload)
        } catch (error) {
          return done(error, false, { message: 'Something went wrong' })
        }
      }
    )
  )

  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body
        try {
          const user = await usersModel.findOne({ email })
          if (user) {
            return done(null, false, { message: 'User already exists' })
          }
          const newUser = await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
          })
          const result = await usersModel.create(newUser)
          return done(null, result)
        } catch (error) {
          return done(null, false, { message: 'Something went wrong' })
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async (email, password, done) => {
        try {
          const user = await usersModel.findOne({ email })
          if (!user) {
            return done(null, false, { message: 'User not found' })
          }
          if (!isValidatePassword(password, user.password)) {
            return done(null, false, { message: 'Wrong password' })
          }
          return done(null, user)
        } catch (error) {
          return done(null, false, { message: 'Something went wrong' })
        }
      }
    )
  )
}

export default initializePassport
