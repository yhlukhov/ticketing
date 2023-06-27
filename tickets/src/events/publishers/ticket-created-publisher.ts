import {Publisher, Subjects, TicketCreatedEvent} from '@yh-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}