import mongoose from 'mongoose';
import Product from '../models/product.js';
import { Promotion } from '../models/product.js';
import { Cart } from '../models/cart.js';
import User from '../models/user.js';
const dbUrl = 'mongodb://localhost:27017/a-shop';

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Mongo server Running');
  })
  .catch((e) => {
    console.log('Error with the Mongo Server');
    console.log(e);
  });

const seeds = async () => {
  const users = await User.updateMany({}, { cart: undefined });
  console.log(users);
  // const promotion = new Promotion({
  //   name: 'expired1',
  //   percent: 25,
  //   createdAt: new Date('2021-07-5'),
  //   expired: new Date('2021-07-5')
  // });
  // promotion.save();
  // console.log(promotion);
};
seeds();

// Product.findById('60d245bf84989b47e49a874c').then((res: void) => {
//   console.log(res);
// });
