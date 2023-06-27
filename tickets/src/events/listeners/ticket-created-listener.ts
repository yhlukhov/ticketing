import {Listener, Subjects, TicketCreatedEvent} from '@yh-tickets/common'
import { Message } from 'node-nats-streaming'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  readonly queueGroupName = ''
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    
  }
}