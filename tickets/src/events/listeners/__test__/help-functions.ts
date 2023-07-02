import { OrderCreatedListener } from '../order-created-listener'
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from '@yh-tickets/common'
import { Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Types } from 'mongoose'
import { OrderCancelledListener } from '../order-cancelled-listener'

// Order Created Listener Setup
export const orderCreatedListenerSetup = async () => {
  const client = natsWrapper.client
  const listener = new OrderCreatedListener(client)
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
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, data, ticket, msg, client }
}

// Order Cancelled Listener Setup
export const orderCancelledListenerSetup = async () => {
  const client = natsWrapper.client
  const listener = new OrderCancelledListener(client)
  const orderId = new Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'Cinema',
    price: 20,
    userId: new Types.ObjectId().toHexString()
  })
  ticket.set({orderId})
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg, client, orderId }
}
