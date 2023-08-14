import { OrderCancelledEvent, OrderStatus } from "@yh-tickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming"
import { Order } from "../../../models"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = await Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: 'userid',
    version: 0,
  }).save()

  const data: OrderCancelledEvent['data'] = {
    id:order.id,
    ticket: {
      id: new Types.ObjectId().toHexString(),
    },
    version: 1
  }
  //@ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }
  return {listener, order, data, msg}
}


it('finds the order, cancells it, and saves in db', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  expect(msg.ack).toHaveBeenCalled()
})