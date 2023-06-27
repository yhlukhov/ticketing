import request from 'supertest'
import { app } from '../../app'

export const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({ title, price })
    .expect(201)
}

export const updateTicket = (title: string, price: number, id: string) => {
  return request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signup())
    .send({ title, price })
    .expect(200)
}
