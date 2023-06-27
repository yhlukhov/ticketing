import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
  var signup: () => Promise<string[]>
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf1234'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await connect(mongoUri)
})

beforeEach(async () => {
  const collections = await connection.db.collections()
  for (let collection of collections) {
    collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await connection.close()
})

global.signup = async () => {
  const email = 'test@gmail.com'
  const password = '1234'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
