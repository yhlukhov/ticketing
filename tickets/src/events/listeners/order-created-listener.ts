import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from '@yh-tickets/common'
import { TicketUpdatedPublisher } from '../publishers'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.orderId = data.id
    await ticket.save()
    // Emit event: "ticket updated"
    const {id, title, price, userId, version, orderId} = ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      userId,
      version,
      orderId
    })
    msg.ack()
  }
}
