import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'
console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')

  stan.on('close', () => {
    console.log('NATS publisher connection closed')
    process.exit()
  })

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'Concert',
      price: 20,
      userId: 'user123'
    })
  } catch (e) {
    console.log(e)
  }
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
