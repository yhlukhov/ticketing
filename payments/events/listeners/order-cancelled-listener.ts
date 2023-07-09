import { Listener, OrderCancelledEvent, Subjects } from "@yh-tickets/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //* Implementation
  }
}