import request from 'supertest'
import { Types } from 'mongoose'
import { app } from '../../app'
import { buildTicket } from './helper-functions'

it('returns 404 if the order is is not found', async () => {
  const randomId = new Types.ObjectId()

  await request(app)
    .get(`/api/orders/${randomId}`)
    .set('Cookie', signup())
    .send()
    .expect(404)
})

it('returns 401 error when user tries to fetch another user order', async () => {
  const ticket = await buildTicket()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signup())
    .send()
    .expect(401)
})

it('fetches an order by id', async () => {
  const user = signup()
  const ticket = await buildTicket()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})
