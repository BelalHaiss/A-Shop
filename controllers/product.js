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
exports.deleteProduct = exports.postEditForm = exports.editItemForm = exports.postNewItem = exports.addToCart = exports.newProduct = exports.productItem = exports.productsHome = void 0;
const product_js_1 = __importDefault(require("../models/product.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
const cart_js_1 = require("../models/cart.js");
const uts_js_1 = require("../utilities/uts.js");
const product_js_2 = require("../models/product.js");
const appError_js_1 = require("../utilities/appError.js");
const cloudinary_js_1 = require("../cloudinary/cloudinary.js");
const productsHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_js_1.default.find({});
    res.render('store/home', { products });
});
exports.productsHome = productsHome;
const productItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const item = yield product_js_1.default.findById(id)
            .populate({ path: 'reviews', populate: { path: 'author' } })
            .populate('promotion');
        res.render('store/item', { item });
    }
    catch (e) {
        return next(new appError_js_1.appError('this item is no longer available or it`s invalid item link', 200));
    }
});
exports.productItem = productItem;
const newProduct = (req, res, next) => {
    // authNeeded
    res.render('store/newItem');
};
exports.newProduct = newProduct;
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { qty, color, size } = req.body.item;
        const item = yield product_js_1.default.findById(id).populate('promotion');
        const foundSize = item.size.includes(size);
        const colorValidation = item.color.includes(color);
        const user = yield user_js_1.default.findById(req.user._id);
        if (item.quantity >= qty && foundSize && colorValidation) {
            const finalPrice = uts_js_1.afterDiscount(item) * qty;
            if (!user.cart) {
                const newCart = yield cart_js_1.Cart.create({
                    products: { item, cartQty: qty },
                    user,
                    total: finalPrice
                });
                user.cart = newCart._id;
                req.flash('success', 'Added To The Cart');
                yield user.save();
            }
            else {
                const updatedCart = yield cart_js_1.Cart.findById(user.cart);
                const itemIsThere = updatedCart.products.some((el) => {
                    return el.item.toString() === item._id.toString() ? true : false;
                });
                if (!itemIsThere) {
                    updatedCart.products.push({ item, cartQty: qty });
                    updatedCart.total = updatedCart.total + finalPrice;
                    yield updatedCart.save();
                    req.flash('success', 'Added To The Cart');
                }
                else {
                    req.flash('error', 'You already have this product on your cart');
                }
            }
            res.redirect(`/products/${id}`);
        }
        else {
            return next(new appError_js_1.appError('u have wrong inputs', 400));
        }
    }
    catch (e) {
        next(e);
    }
});
exports.addToCart = addToCart;
const postNewItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, Details, price, QTY, colors, size } = req.body;
        const newProduct = yield product_js_1.default.create({
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
            yield newProduct.save();
        }
        req.flash('success', 'Product is Created');
        res.redirect(`/products/${newProduct._id}`);
    }
    catch (e) {
        next(e);
    }
});
exports.postNewItem = postNewItem;
const editItemForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_js_1.default.findById(req.params.id);
        if (product) {
            res.render('store/edit', { product });
        }
    }
    catch (_a) {
        next(new appError_js_1.appError('there no item to edit', 400));
    }
});
exports.editItemForm = editItemForm;
const postEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, Details, QTY, promotion } = req.body;
        const product = yield product_js_1.default.findByIdAndUpdate(req.params.id, { name, descr: Details, price, quantity: QTY }, { new: true, runValidators: true });
        if (req.file) {
            const { img } = product;
            if (img.filename) {
                yield cloudinary_js_1.cloudinary.uploader.destroy(img.filename);
            }
            const { filename, path } = req.file;
            product.img = {
                url: path,
                filename
            };
        }
        if (promotion) {
            const details = yield product_js_2.Promotion.findOne({ name: promotion });
            if (details) {
                const detailsDate = details.createdAt.getTime();
                const nowDate = new Date().getTime();
                detailsDate > nowDate ? null : (product.promotion = details._id);
            }
        }
        product.save();
        req.flash('success', 'Form is Updated successfully');
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {
        next(e);
    }
});
exports.postEditForm = postEditForm;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_js_1.default.findByIdAndRemove(id);
        if (product.img.filename) {
            const { img: { url, filename } } = product;
            yield cloudinary_js_1.cloudinary.uploader.destroy(filename);
        }
        req.flash('success', ' item is Deleted successfully');
        res.redirect('/products');
    }
    catch (e) {
        next(e);
    }
});
exports.deleteProduct = deleteProduct;
