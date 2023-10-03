import express from 'express'
import passport from 'passport'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import sessionsRouter from './routes/sessions.routes.js'
import initializePassport from './passport/passport.config.js'

// Config
dotenv.config()
const app = express()

// Database
import './database.js'

// Middlewares
app.use(express.json())
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

// Routes
app.use('/api/sessions', sessionsRouter)

// Server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
