import {ExpirationCompleteEvent, Publisher, Subjects} from '@yh-tickets/common'

export class OrderExpiredPublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  
}