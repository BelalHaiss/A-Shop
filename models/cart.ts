import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: { id: false },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      cartQty: Number
    }
  ],
  total: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Cart = mongoose.model('Cart', cartSchema);
