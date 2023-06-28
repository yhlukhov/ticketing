import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'ticket',
    price: 10,
    userId: '12345',
  })

  // Save to DB
  await ticket.save()

  // Fetch ticket twice
  const { id } = ticket
  const ticketOne = await Ticket.findById(id)
  const ticketTwo = await Ticket.findById(id)

  // Make changes in both ticket refs
  ticketOne!.set({ price: 20 })
  ticketTwo!.set({ price: 30 })

  // Save changes in first ticket
  await ticketOne!.save()

  // Save changes in second ticket
  try {
    await ticketTwo!.save()
  } catch (err) {
    return
  }

  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'ticket',
    price: 10,
    userId: '12345',
  })

  // Save to DB and check version
  await ticket.save()
  expect(ticket.version).toEqual(0)

  // Save second time and check version
  await ticket.save()
  expect(ticket.version).toEqual(1)

  // Save third time and check version
  await ticket.save()
  expect(ticket.version).toEqual(2)
})