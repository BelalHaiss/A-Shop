import express, { Router } from 'express';
const router = Router({ mergeParams: true });
import { isAuth } from '../utilities/middleware.js';
const app = express();
import { postReview, deleteReview } from '../controllers/review.js';
router.post('/', isAuth, postReview);

router.delete('/:reviewID', isAuth, deleteReview);

export default router;
