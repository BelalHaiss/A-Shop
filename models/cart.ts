import mongoose from 'mongoose';

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
  total: {
    type: Number,
    required: true
  },
  subTotal: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Cart: any = mongoose.model('Cart', cartSchema);
