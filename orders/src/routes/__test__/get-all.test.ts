import request from 'supertest'
import { app } from '../../app'
import { buildTicket } from './helper-functions'

it('fetches orders for particular user', async () => {
  // Create 3 tickets
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()
  // Create 2 users
  const user1 = signup()
  const user2 = signup()
  // Create 1 order for user1 and 2 orders for user2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)
  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)
  // Make request to get orders for user1
  const { body: ordersUser1 } = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send()
    .expect(200)
  expect(ordersUser1.length).toEqual(1)
  expect(ordersUser1[0].id).toEqual(order1.id)
  // Make request to get orders for user2
  const { body: ordersUser2 } = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send()
    .expect(200)
  expect(ordersUser2.length).toEqual(2)
  expect(ordersUser2[0].id).toEqual(order2.id)
})
