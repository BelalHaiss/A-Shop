import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user.js';
import { appError } from '../utilities/appError.js';
import { isRegisterable, isAuth } from '../utilities/middleware.js';
import {
  renderLogin,
  logout,
  renderRegister,
  register,
  login
} from '../controllers/user.js';
router.route('/register').get(isRegisterable, renderRegister).post(register);

router
  .route('/login')
  .get(renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    login
  );

router.get('/logout', isAuth, logout);

export default router;
