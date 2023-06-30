import { Ticket } from "../../models";
import { Types } from "mongoose";

export async function buildTicket () {
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title:'Concert',
    price:20
  })
  await ticket.save()
  return ticket
}