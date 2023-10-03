import mongoose from 'mongoose'
// import bcrypt from 'bcrypt'

const usersSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String },
  carts: [
    {
      cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
      }
    }
  ],
  role: { type: String, dafault: 'user' }
})

// usersSchema.pre('save', function (next) {
//   const hash = bcrypt.hashSync(this.password, 10)

//   this.password = hash
//   next()
// })

// usersSchema.methods.isValidPassword = function (password) {
//   return bcrypt.compareSync(password, this.password)
// }

export const usersModel = mongoose.model('users', usersSchema)
