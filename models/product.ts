import mongoose, { AnyObject, Schema, SchemaOptions } from 'mongoose';
import Review from './review';

const PromotionSchema: any = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  percent: {
    type: Number,
    min: 1,
    max: 90,
    required: [true, 'you should enter the percentage of the discount']
  },
  createdAt: {
    type: Date,
    min: '2021-06-23',
    max: '2035-05-23'
  },
  allProduct: {
    type: Boolean,
    default: false
  },
  expired: {
    type: Date,
    required: true,
    min: '2021-06-23',
    max: '2035-05-23'
  },
  active: {
    type: Boolean,
    default: true
  }
});

PromotionSchema.post('save', async function (doc) {
  const docDate = doc.createdAt.toISOString();
  const nowDate = new Date().toISOString();
  docDate < nowDate || docDate === nowDate
    ? null
    : await Promotion.findByIdAndUpdate(doc._id, {
        active: false
      });

  if (doc.allProduct === true && (docDate < nowDate || docDate === nowDate)) {
    await Product.updateMany({}, { promotion: doc._id });
  }
});

export const Promotion = mongoose.model('Promotion', PromotionSchema);

const productSchmea = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: [String],
    default: ['black', 'white'],
    required: true
  },
  promotion: {
    type: Schema.Types.ObjectId,
    ref: 'Promotion'
  },
  size: {
    type: [Number],
    default: [37, 38, 39, 40, 41, 42, 43, 45, 46],
    required: true
  },
  price: {
    type: Number,
    min: 1,
    required: true
  },
  img: {
    url: {
      type: String,
      default: process.env.defaultShoesImage
    },

    filename: { type: String }
  },
  descr: {
    type: String,
    default: 'New fancy Sneaker'
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
    default: 2
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});
productSchmea.post('findOneAndRemove', async function (doc) {
  if (doc.reviews && doc.reviews.length >= 1) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});
const Product: any = mongoose.model('Product', productSchmea);
export default Product;
