import express, { Router } from 'express';
const router = Router({ mergeParams: true });
const app = express();
import { isAdmin, isAuth, wrapAsync } from '../utilities/middleware.js';

import {
  promotionPageForm,
  showSinglePromotion,
  postPromotion,
  deletePromotion,
  showAllPromotions
} from '../controllers/promotion';

router
  .route('/')
  .get(isAuth, isAdmin, wrapAsync(showAllPromotions))
  .post(isAuth, isAdmin, wrapAsync(postPromotion));
router.route('/new').get(isAuth, isAdmin, wrapAsync(promotionPageForm));
router
  .route('/:id')
  .get(isAuth, isAdmin, wrapAsync(showSinglePromotion))
  .delete(isAuth, isAdmin, wrapAsync(deletePromotion));

export default router;
