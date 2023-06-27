import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import { requireAuth, validateRequest } from '@yh-tickets/common'
import { Ticket } from '../models'
import { TicketCreatedPublisher } from '../events/publishers'

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater then 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })
    await ticket.save()

    //* Publish an event saying the ticket was created

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
