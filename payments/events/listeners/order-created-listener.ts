import {Listener, OrderCreatedEvent, OrderStatus, Subjects} from '@yh-tickets/common'
import {queueGroupName} from './queue-group-name'
import { Message } from 'node-nats-streaming'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //* Implementation
  }
}