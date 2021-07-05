import Product from '../models/product.js';
import { Promotion } from '../models/product.js';
import { appError } from '../utilities/appError.js';
import { Application, Request, Response, NextFunction } from 'express';
import { model } from 'mongoose';

export const showSinglePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    res.render('promotions/promotion', { promotion });
  } catch (e) {
    next(e);
  }
};

export const showAllPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({});
    res.render('promotions/all', { promotions });
  } catch (e) {
    next(e);
  }
};
export const promotionPageForm = (req, res, next) => {
  req.flash(
    'warning',
    'if you add a starting date not coming yet you will have to promotion name manually'
  );
  try {
    res.render('promotions/newPromotion', { messages: req.flash('warning') });
  } catch (e) {
    next(e);
  }
};

export const postPromotion = async (req, res, next) => {
  try {
    const allNames = await Promotion.exists({ name: req.body.promotion.name });
    if (allNames) {
      return next(
        new appError(
          'there`s a Promotion with same name so please create another one with another name',
          400
        )
      );
    }

    const { allProduct } = req.body;

    const started = req.body.promotion.createdAt
      .replace('-', '')
      .replace('-', '');
    const expired = req.body.promotion.expired
      .replace('-', '')
      .replace('-', '');
    if (!(started < expired)) {
      return next(new appError('check your expired date again', 400));
    }
    const promotion: any = await new Promotion(req.body.promotion);

    if (allProduct === 'all') {
      promotion.allProduct = true;
    } else {
      promotion.allProduct = false;
    }
    await promotion.save();
    res.redirect(`/promotion/${promotion._id}`);
  } catch (e) {
    next(e);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndRemove(req.params.id);

    const products = await Product.updateMany(
      { promotion: req.params.id },
      { promotion: 'undefined' }
    );

    res.redirect('/promotion');
  } catch (e) {
    next(e);
  }
};
