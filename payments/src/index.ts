import mongoose from 'mongoose'
import { natsWrapper } from './nats-wrapper'
import { app } from './app'
import { OrderCreatedListener, OrderCancelledListener } from './events/listeners'



const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY undefined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI undefined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL undefined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID undefined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID undefined')
  }

  try {
    console.log('Starting...')
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, {
      url: process.env.NATS_URL,
    })
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI)
  } catch (err) {
    console.error(err)
  }
}

app.listen(3000, async () => {
  await start()
  console.log('Payments service is listening on port: 3000')
})
