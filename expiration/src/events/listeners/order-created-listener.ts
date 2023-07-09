import { Listener, OrderCreatedEvent, Subjects } from '@yh-tickets/common'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues'
import { Message } from 'node-nats-streaming'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add(
      { 
        orderId: data.id 
      },
      {
        delay,
      }
    )
    msg.ack()
  }
}