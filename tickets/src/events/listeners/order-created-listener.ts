import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from '@yh-tickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new NotFoundError()
    }
    ticket.orderId = data.id
    await ticket.save()
    msg.ack()
  }
}
