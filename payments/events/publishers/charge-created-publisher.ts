import {Publisher, Subjects, ChargeCreatedEvent} from '@yh-tickets/common'

export class ChargeCreatedPublisher extends Publisher<ChargeCreatedEvent> {
  readonly subject = Subjects.ChargeCreated
}