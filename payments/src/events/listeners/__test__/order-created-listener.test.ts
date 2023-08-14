import { OrderCreatedEvent, OrderStatus } from '@yh-tickets/common'
import { Types } from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    expiresAt: 'tomorrow',
    status: OrderStatus.Created,
    ticket: { id: new Types.ObjectId().toHexString(), price: 20 },
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  }
  //@ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('saves and order in db and ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.id).toEqual(data.id)
  expect(order!.price).toEqual(data.ticket.price)
  expect(msg.ack).toHaveBeenCalled()
})