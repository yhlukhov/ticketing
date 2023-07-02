import { Ticket } from '../../../models'
import { orderCancelledListenerSetup } from './help-functions'

it('Unsets orderId for the ticket, publishes a Ticket Cancelled event, acks the message', async () => {
  const { listener, data, ticket, msg, client } = await orderCancelledListenerSetup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toBeUndefined()
  expect(client.publish).toHaveBeenCalled()
  const ticketUpdatedData = JSON.parse((client.publish as jest.Mock).mock.calls[0][1])
  expect(ticketUpdatedData.orderId).toBeUndefined()
  expect(msg.ack).toHaveBeenCalled()
})
