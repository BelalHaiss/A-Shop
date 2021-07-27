"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.deleteFromCart = exports.viewCart = void 0;
const cart_1 = require("../models/cart");
const user_1 = __importDefault(require("../models/user"));
const appError_1 = require("../utilities/appError");
const viewCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.cart) {
            const cart = yield cart_1.Cart.findById(req.user.cart).populate({
                path: 'products',
                populate: { path: 'item', populate: { path: 'promotion' } }
            });
            console.log(cart);
            cart.products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                if (product.item.promotion === null && product.discount !== 0) {
                    product.price = product.price + product.discount;
                    product.discount = 0;
                    const saveCart = yield cart.save();
                }
            }));
            res.render('store/cart', { cart });
        }
        else {
            res.render('store/cart');
        }
    }
    catch (e) {
        req.flash('error', 'something is going wrong please add items to your cart first');
        next(e);
    }
});
exports.viewCart = viewCart;
const deleteFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, item, cartQty, discount, color, size, price } = req.body;
        const user = yield user_1.default.findById(req.user);
        const cartidForCheckOnly = yield cart_1.Cart.findById(cartId);
        if (user.cart.toString() === cartidForCheckOnly._id.toString()) {
            const cart = yield cart_1.Cart.updateOne({ _id: cartId }, {
                $pull: { products: { item, cartQty, color, size, price, discount } }
            });
            if (cart.nModified === 1) {
            }
            else {
                req.flash('error', 'something wrong with your request ');
            }
        }
        else {
            req.flash('error', 'You don`t have permisson for that');
        }
        return res.redirect('/cart');
    }
    catch (e) {
        next(e);
    }
});
exports.deleteFromCart = deleteFromCart;
const checkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.user);
    const cart = yield cart_1.Cart.findById(req.params.id);
    if (user.cart.toString() === cart._id.toString()) {
        const order = yield cart_1.Order.create({
            user: user._id,
            address: user.addresses[0]
        });
        if (order) {
            const deleteCart = yield cart_1.Cart.findByIdAndRemove(cart._id);
            console.log(order, 'order');
        }
    }
    else {
        return next(new appError_1.appError('Your are not authoried', 401));
    }
    res.end();
});
exports.checkout = checkout;
