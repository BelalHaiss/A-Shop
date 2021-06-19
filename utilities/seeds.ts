import mongoose from 'mongoose';
import { Product } from '../models/product';
console.log(Product)
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
    
      
  }  