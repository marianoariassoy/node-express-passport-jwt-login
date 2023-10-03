import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

router.get('/', (req, res) => {
  res.send('Welcome to sessions')
})

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res) => {
  res.json({
    message: 'User created successfully',
    user: req.user
  })
})

router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
  const { email, password } = req.body
  const token = jwt.sign({ email, password }, process.env.JWT_SECRET)
  res.cookie('jwt-cookie', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  })
  res.send({ stutus: 'Logged in', token: token })
})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user)
})

router.get('/logout', async (req, res) => {
  res.clearCookie('jwt-cookie')
  res.send('Logged out')
})

export default router
