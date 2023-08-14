import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@yh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming"
import { Order } from "../../models";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {id, status, ticket: {price}, userId, version} = data
    const order = Order.build({
      id, price, status, userId, version
    })
    await order.save()

    msg.ack()
  }
}