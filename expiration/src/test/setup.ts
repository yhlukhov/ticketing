import jwt from 'jsonwebtoken'

declare global {
  var signup: () => string[]
}

jest.mock('../nats-wrapper')

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf1234'
})

beforeEach(async () => {
  jest.clearAllMocks()
})

afterAll(async () => {

})