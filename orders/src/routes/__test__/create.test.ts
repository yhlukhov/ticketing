import request from 'supertest'
import { Types } from 'mongoose'
import { Ticket, Order, OrderStatus } from '../../models'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
const mongoId = () => new Types.ObjectId().toHexString()

it('has a route handler', async () => {
  const response = await request(app).post('/api/orders').send({})
  expect(response.status).not.toEqual(404)
})

it('is accessed if user is signed in', async () => {
  const response = await request(app).post('/api/orders').set('Cookie', signup()).send({})
  expect(response.status).not.toEqual(401)
})

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401)
})

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new Types.ObjectId()
  await request(app).post('/api/orders').set('Cookie', signup()).send({ ticketId }).expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await Ticket.build({
    id: mongoId(),
    title: 'Concert',
    price: 20,
  }).save()

  const order = await Order.build({
    ticket,
    userId: 'aslkfdjaslf1',
    expiresAt: new Date(),
    status: OrderStatus.Created
  }).save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(400)
})

it('reserves the ticket', async () => {
  const ticket = await Ticket.build({
    id: mongoId(),
    title: 'Concert',
    price: 20,
  }).save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = await Ticket.build({
    id: mongoId(),
    title: 'Concert',
    price: 20,
  }).save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})