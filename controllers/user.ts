import { appError } from '../utilities/appError.js';
import User from '../models/user.js';
export const renderRegister = async (req, res, next) => {
  res.render('users/register');
};

export const register = async (req, res, next) => {
  try {
    const { email, username, firstName, lastName, password, address } =
      req.body;
    const user = new User({ email, firstName, lastName, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      user.addresses.push(address);
      req.flash('success', `Welcoem ${user.firstName}`);
      user.save();
      res.redirect('/products');
    });
  } catch (e) {
    req.flash('error', e.message);
    req.flash('error', 'Please Try again with another informations');
    res.redirect('register');
  }
};
export const renderLogin = async (req, res) => {
  res.render('users/login');
};
export const login = async (req, res) => {
  if (
    req.user.username === 'admin' &&
    req.user._id.toString() === process.env.adminId
  ) {
    req.session.admin = true;
  }
  const redirectUrl = req.session.returnTo || '/products';
  res.redirect(redirectUrl);
  delete req.session.returnTo;
};

export const logout = async (req, res) => {
  if (req.session.admin === true) {
    delete req.session.admin;
  }
  if (req.session.returnTo) {
    delete req.session.returnTo;
  }
  req.logout();

  res.redirect('/campgrounds');
};
