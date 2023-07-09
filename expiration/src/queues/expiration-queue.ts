import Queue from 'bull'
import { OrderExpiredPublisher } from '../events/publishers/order-expired-publisher'
import { natsWrapper } from '../nats-wrapper'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async (job) => {
  const {orderId} = job.data
  new OrderExpiredPublisher(natsWrapper.client).publish({orderId})
})

export { expirationQueue }
