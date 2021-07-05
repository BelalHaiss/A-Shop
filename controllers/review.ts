import Review from '../models/review.js';
import { appError } from '../utilities/appError.js';
import Product from '../models/product.js';

import { Application, Request, Response, NextFunction } from 'express';

export const postReview = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const item: any = await Product.findById(req.params.id);
    const review: any = await Review.create(req.body.review);
    review.author = req.user._id;
    review.save();
    item.reviews.push(review);

    await item.save();
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    next(e);
    // next(new appError('u have add a wrong rating info', 400));
  }
};

export const deleteReview = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const reviewAuthor: any = await Review.findById(reviewID);
  if (!reviewAuthor.author.equals(req.user._id)) {
    req.flash('error', 'you don`t have permisson for that');
    return res.redirect(`/products/${id}`);
  }
  const item = await Product.findByIdAndUpdate(id, {
    $pull: { reviews: reviewID }
  });
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/products/${id}`);
};
