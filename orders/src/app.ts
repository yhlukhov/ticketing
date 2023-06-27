import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from '@yh-tickets/common'
import {
  createOrderRouter,
  deleteOrderRouter,
  getAllOrdersRouter,
  getOneOrderRouter,
} from './routes'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(getAllOrdersRouter)
app.use(getOneOrderRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
