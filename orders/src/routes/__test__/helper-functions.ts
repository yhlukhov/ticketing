import { Ticket } from "../../models";

export async function buildTicket () {
  const ticket = Ticket.build({
    title:'Concert',
    price:20
  })
  await ticket.save()
  return ticket
}