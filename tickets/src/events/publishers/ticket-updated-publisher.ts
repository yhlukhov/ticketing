import { Publisher, Subjects, TicketUpdatedEvent } from "@yh-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}