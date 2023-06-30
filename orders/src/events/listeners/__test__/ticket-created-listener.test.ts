import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from '@yh-tickets/common'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models'

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    price: 10,
    title: 'Cinema 1D',
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  }
  // @ts-ignore
  const msg:Message = {
    ack:jest.fn()
  }
  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)
  expect(ticket).not.toEqual(null)
  expect(ticket!.title).toEqual(data.title)

})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
