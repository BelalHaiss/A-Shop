import express, { Application, Request, Response, NextFunction } from 'express';
const app: Application = express();
import path from 'path';
import ejsMate from 'ejs-mate';
import mongoose from 'mongoose';
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.render('store/home');
});

app.listen(4000, (): void => console.log('server 4000 is running'));
