import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidatePassword = (user, password) => bcrypt.compareSync(user, password)

// export const createToken = user => jwt.sign(user, process.env.JWT_SECRET)

// export const validateToken = token => jwt.verify(token, process.env.JWT_SECRET)

// const authToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']

//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.stutus(401).send('Unauthorized')

//   validateToken(token)
//     .then(user => {
//       req.user = user
//       next()
//     })
//     .catch(err => {
//       res.status(401).send('Unauthorized')
//     })
//   next()
// }
