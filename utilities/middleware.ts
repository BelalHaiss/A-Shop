import { appError } from './appError.js';

export const wrapAsync = function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};

export const isRegisterable = async (req, res, next) => {
  if (req.user)
    return next(
      new appError(
        'you can`t sign up while your are login , you can logout and get back',
        400
      )
    );
  next();
};
export const isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;

    req.flash('error', 'you must be signed in first');

    return res.redirect('/login');
  }

  next();
};

export const isAdmin = async (req, res, next) => {
  if (
    req.user.username === 'admin' &&
    req.user._id.toString() === process.env.adminId
  ) {
    req.session.admin = true;

    next();
  } else {
    req.flash('error', 'Your are not authorized for this');

    return res.redirect('/products');
  }
};
