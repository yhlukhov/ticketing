import { OrderStatus } from '@yh-tickets/common'
import { Document, Model, Schema, model } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  id: string
  version: number
  price: number
  userId: string
  status: OrderStatus
}

interface OrderDoc extends Document {
  version: number
  price: number
  userId: string
  status: OrderStatus
}

interface OrderModel extends Model<OrderDoc> {
  build(atts: OrderAttrs): OrderDoc
}

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) }
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  })

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
