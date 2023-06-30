import express, { Request, Response } from 'express'
import { Order, OrderStatus } from '../models'
import { NotAuthorizedError, NotFoundError, requireAuth } from '@yh-tickets/common'
import { OrderCancelledPublisher } from '../events/publishers'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    order.status = OrderStatus.Cancelled
    await order.save()
    
    // Publish an event saying that order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    })
    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
