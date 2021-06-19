import mongoose, { Schema } from 'mongoose';

const productSchmea = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});
module.exports.Product = mongoose.model('Product', productSchmea);
