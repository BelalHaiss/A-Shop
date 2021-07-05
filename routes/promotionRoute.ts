import express, { Router } from 'express';
const router = Router({ mergeParams: true });
const app = express();
import { isAdmin, isAuth } from '../utilities/middleware.js';

import {
  promotionPageForm,
  showSinglePromotion,
  postPromotion,
  deletePromotion,
  showAllPromotions
} from '../controllers/promotion';

router
  .route('/')
  .get(isAuth, isAdmin, showAllPromotions)
  .post(isAuth, isAdmin, postPromotion);
router.route('/new').get(isAuth, isAdmin, promotionPageForm);
router
  .route('/:id')
  .get(isAuth, isAdmin, showSinglePromotion)
  .delete(isAuth, isAdmin, deletePromotion);

export default router;
