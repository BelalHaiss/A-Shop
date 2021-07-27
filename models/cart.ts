import mongoose from 'mongoose';
import User from './user.js';

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: { id: false },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      cartQty: { type: Number, required: true },
      size: { type: Number, required: true },
      color: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, required: true }
    }
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
cartSchema.post('findOneAndRemove', async function (doc) {
  if (doc.user) {
    const pullCartFromUser = await User.findByIdAndUpdate(doc.user, {
      cart: undefined
    });
  }
});

export const Cart: any = mongoose.model('Cart', cartSchema);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  subTotal: {
    type: Number,
    required: true
  }
});

export const Order: any = mongoose.model('Order', orderSchema);
