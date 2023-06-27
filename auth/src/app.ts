import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { currentUserRouter } from './routes/current-user'
import { signinRouter, signoutRouter, signupRouter } from './routes'
import { errorHandler, NotFoundError } from '@yh-tickets/common'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(currentUserRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
