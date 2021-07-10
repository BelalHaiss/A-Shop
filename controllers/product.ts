import Product from '../models/product.js';
import User from '../models/user.js';
import { Cart } from '../models/cart.js';
import { afterDiscount } from '../utilities/uts.js';
import { Promotion } from '../models/product.js';
import { appError } from '../utilities/appError.js';
import { Application, Request, Response, NextFunction } from 'express';
import { object } from 'joi';
import { cloudinary } from '../cloudinary/cloudinary.js';
export const productsHome = async (req: Request, res: Response) => {
  const products = await Product.find({}).populate('promotion');
  res.render('store/home', { products });
};
export const productItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const item = await Product.findById(id)
      .populate({ path: 'reviews', populate: { path: 'author' } })
      .populate('promotion');
    res.render('store/item', { item });
  } catch (e) {
    return next(
      new appError(
        'this item is no longer available or it`s invalid item link',
        200
      )
    );
  }
};
export const newProduct = async (req, res, next) => {
  res.render('store/newItem');
};

export const addToCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qty, color, size } = req.body.item;
    const item: any = await Product.findById(id).populate('promotion');
    const foundSize = item.size.includes(size);
    const colorValidation = item.color.includes(color);
    const user = await User.findById(req.user._id);

    if (item.quantity >= qty && foundSize && colorValidation && qty > 0) {
      const finalPrice = afterDiscount(item).price * qty;
      const discount = afterDiscount(item).discount * qty;
      const itemPrice = afterDiscount(item).itemPrice * qty;
      if (!user.cart) {
        const newCart = await Cart.create({
          products: {
            item,
            cartQty: qty,
            size,
            color,
            price: finalPrice,
            discount
          },
          user,
          total: finalPrice,
          subTotal: itemPrice
        });

        user.cart = newCart._id;
        req.flash('success', 'Added To The Cart');

        await user.save();
      } else {
        const updatedCart: any = await Cart.findById(user.cart);

        const itemIsThere = updatedCart.products.some((el) => {
          return el.item.toString() === item._id.toString() ? true : false;
        });

        updatedCart.products.push({
          item,
          cartQty: qty,
          color,
          size,
          price: finalPrice,
          discount
        });
        updatedCart.total = updatedCart.total + finalPrice;
        updatedCart.subTotal = updatedCart.subTotal + itemPrice;
        await updatedCart.save();

        !itemIsThere
          ? req.flash('success', 'Added To The Cart')
          : req.flash(
              'warning',
              'You added an item that is already on the cart'
            );
      }

      res.redirect(`/products/${id}`);
    } else {
      return next(new appError('u have wrong inputs', 400));
    }
  } catch (e) {
    next(e);
  }
};

export const postNewItem = async (req, res, next) => {
  try {
    const { name, Details, price, QTY, colors, size } = req.body;
    const newProduct = await Product.create({
      name,
      descr: Details,
      price,
      quantity: QTY,
      color: typeof colors === 'object' ? [...colors] : colors,
      size: typeof size === 'object' ? [...size] : size
    });
    if (req.file) {
      const { filename, path } = req.file;

      newProduct.img = {
        url: path,
        filename
      };

      await newProduct.save();
    }
    req.flash('success', 'Product is Created');
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
};

export const editItemForm = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.render('store/edit', { product });
    }
  } catch {
    next(new appError('there no item to edit', 400));
  }
};

export const postEditForm = async (req, res, next) => {
  try {
    const { name, price, Details, QTY, promotion } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, descr: Details, price, quantity: QTY },
      { new: true, runValidators: true }
    );
    if (req.file) {
      const { img } = product;
      if (img.filename) {
        await cloudinary.uploader.destroy(img.filename);
      }
      const { filename, path } = req.file;
      product.img = {
        url: path,
        filename
      };
    }
    if (promotion) {
      const details: any = await Promotion.findOne({ name: promotion });
      if (details) {
        const detailsDate = details.createdAt.getTime();
        const nowDate = new Date().getTime();
        detailsDate > nowDate
          ? req.flash(
              'warning',
              'Please add the promotion on it`s started date or after it'
            )
          : (product.promotion = details._id);
      } else {
        req.flash('error', 'no promotion with this name ');
      }
    }
    product.save();
    req.flash('success', 'Form is Updated successfully');
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    next(e);
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndRemove(id);
    if (product.img.filename) {
      const {
        img: { url, filename }
      } = product;
      await cloudinary.uploader.destroy(filename);
    }
    req.flash('success', ' item is Deleted successfully');
    res.redirect('/products');
  } catch (e) {
    next(e);
  }
};
