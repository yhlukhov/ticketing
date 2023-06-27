import { Schema, model, Model, Document } from 'mongoose'
import { Password } from '../services'

interface UserAttrs {
  email: string
  password: string
}

// Interface describes properties that a User Documetn has
interface UserDoc extends Document {
  email: string
  password: string
}

// Interface describes properties that User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
}, {
  toJSON:  {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
    },
    versionKey:false
  }
})

UserSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = model<UserDoc, UserModel>('User', UserSchema)

export { User }
