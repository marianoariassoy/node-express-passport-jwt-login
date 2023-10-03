import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import { usersModel } from '../model/users.model.js'
import { createHash, isValidatePassword } from '../utils.js'
import dotenv from 'dotenv'

// Config
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
dotenv.config()

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
        } catch (err) {
          return done(err)
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
            console.log('User already exists')
            return done(null, false)
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
          console.log(error)
          return done(null, false)
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
            console.log('User not found')
            return done(null, false)
          }

          if (!isValidatePassword(password, user.password)) {
            console.log('Wrong password')
            return done(null, false)
          }

          return done(null, user)
        } catch (error) {
          console.log(error)
          return done(null, false)
        }
      }
    )
  )
}

export default initializePassport
