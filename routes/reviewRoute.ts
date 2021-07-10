import express, { Router } from 'express';
const router = Router({ mergeParams: true });
import { isAuth, wrapAsync } from '../utilities/middleware.js';
const app = express();
import { postReview, deleteReview } from '../controllers/review.js';
router.post('/', isAuth, wrapAsync(postReview));

router.delete('/:reviewID', isAuth, wrapAsync(deleteReview));

export default router;
