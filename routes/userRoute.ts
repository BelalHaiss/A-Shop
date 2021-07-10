import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user.js';
import { appError } from '../utilities/appError.js';
import { isRegisterable, isAuth, wrapAsync } from '../utilities/middleware.js';
import {
  renderLogin,
  logout,
  renderRegister,
  register,
  login
} from '../controllers/user.js';
router
  .route('/register')
  .get(wrapAsync(isRegisterable), wrapAsync(renderRegister))
  .post(wrapAsync(register));

router
  .route('/login')
  .get(renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    wrapAsync(login)
  );

router.get('/logout', isAuth, wrapAsync(logout));

export default router;
