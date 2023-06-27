import request from 'supertest'
import { app } from '../../app'

it('allows password only between 4 and 20 characters', async () => {
  await signup()

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@gmail.com',
      password: '123',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@gmail.com',
      password: '12345678901234567890!',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '1234' })
    .expect(200)
})

it('fails if email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email:'not_registered@gmail.com',
      password:'1234'
    })
    expect(400)
})

it ('fails if incorrect password is used', async () => {
  await signup()

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@gmail.com',
      password: 'invalid_password'
    })
    .expect(400)
})

it('successfully signs in existing user', async () => {
  await signup()

  const resposne = await request(app)
    .post('/api/users/signin')
    .send({
      email:'test@gmail.com',
      password:'1234'
    })
    .expect(200)

  expect(resposne.get('Set-Cookie')).toBeDefined()
})