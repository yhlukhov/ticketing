import { Order, OrderStatus, Ticket } from '../../../models'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderExpiredListener } from '../order-expired-listener'
import { OrderCreatedPublisher } from '../../publishers'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { ExpirationCompleteEvent, Subjects } from '@yh-tickets/common'

const setup = async () => {
  const listener = new OrderExpiredListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    title: 'Concert',
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: 'user-id',
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, order, data, msg }
}

it('listens for order expired event, updates order status to cancelled and acks message', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  expect(msg.ack).toHaveBeenCalled()
})

it('emits an OrderCancelled event', async () => {
  const { listener, data, order, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(eventData.id).toEqual(order.id)
})
