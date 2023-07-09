import express, { Request, Response } from 'express'
import {
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest,
  OrderStatus,
} from '@yh-tickets/common'
import { body } from 'express-validator'
import { Types } from 'mongoose'
import { Order, Ticket } from '../models'
import { OrderCreatedPublisher } from '../events/publishers'
import { natsWrapper } from '../nats-wrapper'
const EXPIRATION_MINS = 1 //! 15

const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .isString()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage('Valid ticketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket in DB
    if (!ticketId) {
      throw new NotFoundError()
    }
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // Trow error is ticket is already reserved
    if (await ticket.isReserved()) {
      throw new BadRequestError('The ticket is already reserved')
    }

    // Calculate expiration date for order
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRATION_MINS)

    // Build the order and save it to DB
    const order = Order.build({
      ticket,
      expiresAt,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
    })
    await order.save()

    // Publish an event saying the order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      version: order.version,
    })

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
