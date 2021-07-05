import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  addresses: [
    {
      _id: { id: false },

      country: { type: String },
      city: { type: String },
      street: { type: String }
    }
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }
});
userSchema.plugin(passportLocalMongoose);
const User: any = mongoose.model('User', userSchema);
export default User;
