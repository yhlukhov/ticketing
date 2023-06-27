import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1234',
    })
    .expect(201)
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalid@email',
      password: '1234',
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1',
    })
    .expect(400)
})

it('returns a 400 with missing email and/or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: '1234',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
    })
    .expect(400)
    
  await request(app)
    .post('/api/users/signup')
    .send({ })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1234',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1234',
    })
    .expect(400)
})

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1234'
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
    
})