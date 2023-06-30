import { Listener, Subjects, TicketUpdatedEvent } from '@yh-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models'
import { Message } from 'node-nats-streaming'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    // const ticket = await Ticket.findById(id)
    const ticket = await Ticket.findByEvent(data)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
