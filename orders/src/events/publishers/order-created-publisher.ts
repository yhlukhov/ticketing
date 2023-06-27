import {Subjects, Publisher, OrderCreatedEvent} from '@yh-tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}