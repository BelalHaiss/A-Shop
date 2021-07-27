import express, { Router } from 'express';
import { viewCart, deleteFromCart, checkout } from '../controllers/Cart.js';
const router = Router();
const app = express();
import { isAdmin, isAuth, wrapAsync } from '../utilities/middleware.js';

router
  .route('/')
  .get(isAuth, wrapAsync(viewCart))
  .post(isAuth, wrapAsync(deleteFromCart));
router.route('/:id').post(isAuth, wrapAsync(checkout));

export default router;
