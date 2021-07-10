import { Cart } from '../models/cart';
import User from '../models/user';
import mongoose from 'mongoose';
export const viewCart = async (req, res, next) => {
  try {
    if (req.user && req.user.cart) {
      const cart: any = await Cart.findById(req.user.cart).populate({
        path: 'products',
        populate: { path: 'item', populate: { path: 'promotion' } }
      });
      res.render('store/cart', { cart });
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
    console.log(cartidForCheckOnly);

    if (user.cart.toString() === cartidForCheckOnly._id.toString()) {
      const cart = await Cart.updateOne(
        { _id: cartId },
        {
          $pull: { products: { item, cartQty, color, size, price, discount } }
        }
      );

      if (cart.nModified === 1) {
        const originalPrice = Number(price) + Number(discount);
        cartidForCheckOnly.total = cartidForCheckOnly.total - price;
        cartidForCheckOnly.subTotal =
          cartidForCheckOnly.subTotal - originalPrice;
        await cartidForCheckOnly.save();
        console.log(cartidForCheckOnly, originalPrice, price, discount);
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
