import request from "supertest";
import {Ticket} from '../../models'
import {app} from '../../app'
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler for /api/tickets post request', async () => {
  const response = await request(app).post('/api/tickets').send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})

it('is accessed if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({title:'', price: 200})
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({price:200})
    .expect(400)
})

it('returns an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({ title: 'Title', price: 'twenty' })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({ title: 'Title', price: -20.0 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({title:'Title' })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title: 'Ticket',
      price: 100
    })
    .expect(201)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title: 'Ticket 2',
      price: 10.5,
    })
    .expect(201)

  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(2)
})

it('publishes an event', async () => {
  const title = 'Ticket for concert'
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({title, price: 20 })
    .expect(201)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})