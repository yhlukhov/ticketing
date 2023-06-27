import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection, Types } from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  var signup: () => string[]
}

// Mocking usage of nats-wrapper on test environment
// It will replace actual nats-wrapper with one defined in
// src/__mocks__/nats-wrapper.ts (notice same file name)
jest.mock('../nats-wrapper') 

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
  jest.clearAllMocks()
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await connection.close()
})

global.signup = () => {
  // Build JWT payload {id, email}
  const payload = {
    id: new Types.ObjectId().toHexString(),
    email: 'test@gmail.com',
  }
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  // Bild session object {jwt: MY_JWT}
  const session = { jwt: token }
  // Turn that session into string
  const sessionJSON = JSON.stringify(session)
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // Return a string that's the cookie and encoded data
  return [`session=${base64}`]
}
