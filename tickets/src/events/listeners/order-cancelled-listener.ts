import { Listener, NotFoundError, OrderCancelledEvent, Subjects } from "@yh-tickets/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models"
import { TicketUpdatedPublisher } from "../publishers"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set({orderId: undefined})
    await ticket.save()
    // Emit event: "ticket updated"
    const {id, title, price, userId, version, orderId} = ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      userId,
      version,
      orderId
    })
    msg.ack()
  }
}