import { Publisher, Subjects, OrderCancelledEvent } from "@yh-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}