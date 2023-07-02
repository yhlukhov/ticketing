
import { OrderCancelledEvent } from "@yh-tickets/common"
import { OrderCreatedListenerSetup } from "./help-functions"
import { Ticket } from "../../../models"
import { Message } from "node-nats-streaming"


it('listens for order created event', async () => {
  const {listener, data, ticket, msg} = await OrderCreatedListenerSetup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await OrderCreatedListenerSetup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})