import mongoose from 'mongoose';
import Product from '../models/product.js';
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
  const newUser = await User.deleteOne({ email: 'admin@gmail.com' });
  console.log(newUser);
};
seeds();

// Product.findById('60d245bf84989b47e49a874c').then((res: void) => {
//   console.log(res);
// });
