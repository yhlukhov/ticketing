import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'
import { Order, Payment } from '../../models'
import { OrderStatus } from '@yh-tickets/common'
import { stripe } from '../../stripe'
// jest.mock('../../stripe') // Local ENV test

it('returns 404 if order not found', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signup())
    .send({ token: 'tok_visa', orderId: new Types.ObjectId().toHexString() })
    .expect(404)
})

it('returns 401 if user not found', async () => {
  const order = await Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  }).save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signup())
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(401)
})

it('returns 400 if order was cancelled', async () => {
  const userId = new Types.ObjectId().toHexString()
  const user = signup(userId)
  const order = await Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
  }).save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(400)
})

it('creates an order with valid data, returns 201', async () => {
  const userId = new Types.ObjectId().toHexString()
  const user = signup(userId)
  const price = Math.floor(Math.random() * 100000)

  const order = await Order.build({
    id: new Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userId,
    version: 0,
  }).save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201)

    const chargeList = await stripe.charges.list()
    const stripeCharge = chargeList.data.find(charge => (
      charge.amount === price*100
    ))
    expect(stripeCharge).toBeDefined()
    expect(stripeCharge!.currency).toEqual('uah')

    const payment = await Payment.findOne({chargeId:stripeCharge!.id, orderId:order.id})
    expect(payment).not.toBeNull()

    // Local ENV tests:
    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    // expect (chargeOptions.source).toEqual('tok_visa')
    // expect(chargeOptions.amount).toEqual(10*100)
    // expect(chargeOptions.currency).toEqual('uah')
})
