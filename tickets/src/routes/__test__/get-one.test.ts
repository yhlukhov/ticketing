import request from 'supertest'
import {Types} from 'mongoose'
import { app } from '../../app'
import { createTicket } from './helper-functions'


it('returns 404 if the ticket is not found', async () => {
  const id = new Types.ObjectId().toHexString() // generate valid id
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})


it('returns existing ticket', async () => {
  const title = 'Ticket to concert'
  const price = 25
  const response = await createTicket(title, price)

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticket.body.title).toEqual(title)
  expect(ticket.body.price).toEqual(price)
})
