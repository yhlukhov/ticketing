import { Document, Model, Schema, model } from 'mongoose'

interface PaymentAttrs {
  chargeId: string
  orderId: string
}

interface PaymentDoc extends Document {
  chargeId: string
  orderId: string
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new Schema(
  {
    chargeId: { type: String, required: true },
    orderId: { type: String, required: true },
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs)
}

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export {Payment}