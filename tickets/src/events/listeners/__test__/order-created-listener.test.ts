import { orderCreatedListenerSetup } from './help-functions'
import { Ticket } from '../../../models'

it('listens for order created event', async () => {
  const { listener, data, ticket, msg } = await orderCreatedListenerSetup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await orderCreatedListenerSetup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a Ticket Updated event', async () => {
  const { listener, data, msg, client } = await orderCreatedListenerSetup()
  await listener.onMessage(data, msg)
  expect(client.publish).toHaveBeenCalled()
  const ticketUpdatedData = JSON.parse((client.publish as jest.Mock).mock.calls[0][1])
  expect(ticketUpdatedData.orderId).toEqual(data.id)
})
