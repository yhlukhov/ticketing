import request from 'supertest'
import { Types } from 'mongoose'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models'

it('returns 404 if the ID does not exist', async () => {
  const id = new Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signup())
    .send({ title: 'Title', price: 20 })
    .expect(404)
})

it('returns 401 if user is not authenticated', async () => {
  const id = new Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Title', price: 20 })
    .expect(401)
})

it('returns 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({ title: 'Ticket on concert', price: 20 })
    .expect(201)

  const { id } = response.body

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signup())
    .send({
      title: 'New title',
      price: 100,
    })
    .expect(401)

  const ticket = await request(app).get(`/api/tickets/${id}`).send().expect(200)

  expect(ticket.body.title).toEqual('Ticket on concert')
})

it('returns 400 if the user provides invalid title or price', async () => {
  const cookie = signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'New ticket', price: 10 })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Ticket for business class', price: -10 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 300 })
    .expect(400)
})

it('returns 400 if the ticket is reserved', async () => {
  const cookie = signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Movie',
      price: 10,
    })
    .expect(201)
    
  const {id} = response.body
  const ticket = await Ticket.findById(id)
  await ticket!.set({ orderId: new Types.ObjectId().toHexString() }).save()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Movie',
      price: 20,
    })
    .expect(400)
})

it('updates ticket with new valid data', async () => {
  const cookie = signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'New ticket', price: 20 })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: 100 })
    .expect(200)

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticket.body.title).toEqual('Updated title')
  expect(ticket.body.price).toEqual(100)
})

it('publishes and event on update', async () => {
  const cookie = signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'New ticket', price: 20 })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: 100 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
