import { PaymentCreatedEvent, Publisher, Subjects } from "@yh-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}