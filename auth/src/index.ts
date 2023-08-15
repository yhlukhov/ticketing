import { connect } from 'mongoose'
import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY undefined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI undefined')
  }
    try {
      await connect(process.env.MONGO_URI)
      console.log('Connected to Mongodb')
    } catch (err) {
      console.error(err)
    }
}

app.listen(3000, async () => {
  await start()
  console.log('Auth Service is listening on port: 3000')
})
