import request from 'supertest'
import { app } from '../../app'
import { buildTicket } from './helper-functions'
import { Order, OrderStatus } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

it('deletes the order', async () => {
  const user = signup()
  const ticket = await buildTicket()
  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id})
    .expect(201)
  // Cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  const cancelledOrder = await Order.findById(order.id)

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an event that order was cancelled', async () => {
  const user = signup()
  const ticket = await buildTicket()
  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)
  // Cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)
  // Verity it emits an event
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})