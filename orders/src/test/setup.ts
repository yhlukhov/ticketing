import {connect, connection, Types} from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'

declare global {
  var signup: () => string[]
}

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
  if(mongo) {
    await mongo.stop()
  }
  await connection.close()
})

global.signup = () => {
  // Build JWT payload {id, email}
  const payload = {
    id: new Types.ObjectId().toHexString(),
    email: 'test@gmail.com'
  }
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  // Build session object
  const session = {jwt:token}
  // Turn session object into string
  const sessionJSON = JSON.stringify(session)
  // Encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // Return the string that's the cookie and encoded data
  return [`session=${base64}`]
}