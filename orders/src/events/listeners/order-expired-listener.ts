import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models'
import { OrderCancelledPublisher } from '../publishers'
import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@yh-tickets/common'

export class OrderExpiredListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) {
      throw new Error('Order not found')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()
    await new OrderCancelledPublisher(this.client).publish({
      id: order._id,
      version: order.version,
      ticket: {id: order.ticket.id}
    })
    msg.ack()
  }
}
