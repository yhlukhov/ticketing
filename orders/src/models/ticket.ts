import { Document, model, Model, Schema } from 'mongoose'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

interface TicketDoc extends Document {
  id: string
  title: string
  price: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, title, price } = attrs
  return new Ticket({
    _id: id,
    title,
    price,
  })
}

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  })
  return !!existingOrder
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket, TicketDoc }
