import Joi from 'joi';
import { appError } from './appError.js';

export const itemToCartSchema = (req, res, next) => {
  const cartSchema = Joi.object({
    item: Joi.object({
      qty: Joi.number().required(),
      size: Joi.number().required(),
      color: Joi.string().required()
    }).required()
  });
  const { error } = cartSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    next(new appError(msg, 400));
  } else {
    next();
  }
};
