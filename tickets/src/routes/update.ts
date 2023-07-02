import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@yh-tickets/common'
import { Ticket } from '../models'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers'

const router = Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater then 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (ticket.orderId) {
      throw new BadRequestError('Ticket has already been reserved')
    }

    const { title, price } = req.body
    ticket.set({ title, price })
    await ticket.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
