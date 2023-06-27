import request from 'supertest'
import {app} from '../../app'
import { createTicket } from './helper-functions'


it('returns list of found tickets', async () => {

  await createTicket('Ticket for concert', 30)
  await createTicket('Ticket for show', 50.5)

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)
  const tickets = response.body

  expect(tickets.length).toEqual(2)
})