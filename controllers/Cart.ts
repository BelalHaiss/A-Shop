import { Cart, Order } from '../models/cart';
import User from '../models/user';
import { Promotion } from '../models/product';
import mongoose from 'mongoose';
import { appError } from '../utilities/appError';

export const viewCart = async (req, res, next) => {
  try {
    if (req.user && req.user.cart) {
      const cart: any = await Cart.findById(req.user.cart).populate({
        path: 'products',
        populate: { path: 'item', populate: { path: 'promotion' } }
      });
      console.log(cart);
      cart.products.map(async (product) => {
        if (product.item.promotion === null && product.discount !== 0) {
          product.price = product.price + product.discount;

          product.discount = 0;
          const saveCart = await cart.save();
        }
      });
      res.render('store/cart', { cart });
    } else {
      res.render('store/cart');
    }
  } catch (e) {
    req.flash(
      'error',
      'something is going wrong please add items to your cart first'
    );
    next(e);
  }
};
export const deleteFromCart = async (req, res, next) => {
  try {
    const { cartId, item, cartQty, discount, color, size, price } = req.body;
    const user = await User.findById(req.user);

    const cartidForCheckOnly = await Cart.findById(cartId);

    if (user.cart.toString() === cartidForCheckOnly._id.toString()) {
      const cart = await Cart.updateOne(
        { _id: cartId },
        {
          $pull: { products: { item, cartQty, color, size, price, discount } }
        }
      );

      if (cart.nModified === 1) {
      } else {
        req.flash('error', 'something wrong with your request ');
      }
    } else {
      req.flash('error', 'You don`t have permisson for that');
    }
    return res.redirect('/cart');
  } catch (e) {
    next(e);
  }
};

export const checkout = async (req, res, next) => {
  const user = await User.findById(req.user);

  const cart: any = await Cart.findById(req.params.id);
  if (user.cart.toString() === cart._id.toString()) {
    const order: any = await Order.create({
      user: user._id,
      address: user.addresses[0]
    });
    if (order) {
      const deleteCart = await Cart.findByIdAndRemove(cart._id);
      console.log(order, 'order');
    }
  } else {
    return next(new appError('Your are not authoried', 401));
  }
  res.end();
};
