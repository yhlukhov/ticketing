import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@yh-tickets/common'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models'
const mongoId = () => new Types.ObjectId().toHexString()

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)
  const ticket = new Ticket({
    id: mongoId(),
    title: 'Concert',
    price: 10,
  })
  await ticket.save()
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    price: 20,
    title: 'Concert - New',
    userId: mongoId(),
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, data, msg }
}

it('finds, updates, saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('does not ack the message if version number is larger then expected', async () => {
  const { listener, data, msg } = await setup()
  ++data.version // modify to simulate unexpected version
  try {
    await listener.onMessage(data, msg)
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled()
})
