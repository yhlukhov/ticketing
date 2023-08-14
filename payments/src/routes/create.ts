import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@yh-tickets/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Order, Payment } from '../models'
import { stripe } from '../stripe'
import { PaymentCreatedPublisher } from '../events/publishers'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled')
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'uah',
      source: token,
    })

    const payment = Payment.build({
      chargeId:charge.id,
      orderId
    })
    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id:payment.id,
      chargeId:charge.id,
      orderId:payment.orderId
    })

    res.status(201).send({ id:payment.id })
  }
)

export { router as createChargeRouter }
