import { model, Model, Schema, Document } from 'mongoose'
import { OrderStatus } from '@yh-tickets/common'
import { TicketDoc } from './ticket'
export { OrderStatus }

interface OrderAttrs {
  userId: string
  ticket: TicketDoc
  status: OrderStatus
  expiresAt: Date
}

interface OrderDoc extends Document {
  userId: string
  ticket: TicketDoc
  status: OrderStatus
  expiresAt: Date
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: Schema.Types.Date },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id
        delete ret._id
      },
    },
  }
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
