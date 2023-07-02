import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@yh-tickets/common'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Types } from 'mongoose'

export const OrderCreatedListenerSetup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = await Ticket.build({
    title: 'Concert',
    price: 10,
    userId: new Types.ObjectId().toHexString(),
  }).save()

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticket: { id: ticket.id, price: ticket.price },
    expiresAt: 'tomorrow',
    status: OrderStatus.Created,
    version: 0,
  }

  // @ts-ignore
  const msg:Message = {
    ack:jest.fn()
  }
  return { listener, data, ticket, msg }
}
