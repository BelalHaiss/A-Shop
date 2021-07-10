if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import express, { Application, Request, Response, NextFunction } from 'express';
const app: Application = express();
import path from 'path';
import ejsMate from 'ejs-mate';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import Product from './models/product.js';
import ProductRoute from './routes/productRoute.js';
import promotionRoute from './routes/promotionRoute.js';
import reviewRoutes from './routes/reviewRoute';
import cartRoute from './routes/cartRoute';
import userRoute from './routes/userRoute';
import { appError } from './utilities/appError.js';
import flash from 'connect-flash';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import localStrategy from 'passport-local';
import User from './models/user.js';
import { afterDiscount } from './utilities/uts.js';

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

app.use(methodOverride('_method'));
const secret: string = process.env.secret || '@#%%@#EDSsdfsdkfdkdk_s';
const store: any = new MongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret
  },

  touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
  store,
  name: 'which-session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req: any, res, next) => {
  res.locals.currentUser = req.user;
  if (res.locals.currentUser) {
    res.locals.userInfo = await User.findOne({
      username: req.user.username
    }).populate('cart');
  }
  res.locals.afterDiscount = afterDiscount;
  req.session.lang
    ? (res.locals.lang = req.session.lang)
    : (res.locals.lang = 'en');
  res.locals.isAdmin = req.session.admin;
  res.locals.req = req;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning');
  next();
});
app.use('/', userRoute);
app.use('/setLang', async (req: any, res: any, next) => {
  const lang = res.locals.lang;
  lang === 'en' ? (req.session.lang = 'ar') : (req.session.lang = 'en');

  return res.end();
});
app.use('/cart', cartRoute);
app.use('/promotion', promotionRoute);
app.use('/products', ProductRoute);
app.use('/products/:id/reviews', reviewRoutes);
app.use('/', (req, res) => {
  res.redirect('/products');
});

app.all('*', (req, res, next) => {
  next(new appError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Oh Boy, something went wrong';
  res.status(status).render('error/error', { err });
});

app.listen(4000, (): void => console.log('server 4000 is running'));
