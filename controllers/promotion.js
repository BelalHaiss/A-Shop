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
exports.deletePromotion = exports.postPromotion = exports.promotionPageForm = exports.showAllPromotions = exports.showSinglePromotion = void 0;
const product_js_1 = __importDefault(require("../models/product.js"));
const product_js_2 = require("../models/product.js");
const appError_js_1 = require("../utilities/appError.js");
const showSinglePromotion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield product_js_2.Promotion.findById(req.params.id);
        res.render('promotions/promotion', { promotion });
    }
    catch (e) {
        next(e);
    }
});
exports.showSinglePromotion = showSinglePromotion;
const showAllPromotions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield product_js_2.Promotion.find({});
        res.render('promotions/all', { promotions });
    }
    catch (e) {
        next(e);
    }
});
exports.showAllPromotions = showAllPromotions;
const promotionPageForm = (req, res, next) => {
    req.flash('warning', 'if you add a starting date not coming yet you will have to promotion name manually');
    try {
        res.render('promotions/newPromotion', { messages: req.flash('warning') });
    }
    catch (e) {
        next(e);
    }
};
exports.promotionPageForm = promotionPageForm;
const postPromotion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allNames = yield product_js_2.Promotion.exists({ name: req.body.promotion.name });
        if (allNames) {
            return next(new appError_js_1.appError('there`s a Promotion with same name so please create another one with another name', 400));
        }
        const { allProduct } = req.body;
        const started = req.body.promotion.createdAt
            .replace('-', '')
            .replace('-', '');
        const expired = req.body.promotion.expired
            .replace('-', '')
            .replace('-', '');
        if (!(started < expired)) {
            return next(new appError_js_1.appError('check your expired date again', 400));
        }
        const promotion = yield new product_js_2.Promotion(req.body.promotion);
        if (allProduct === 'all') {
            promotion.allProduct = true;
        }
        else {
            promotion.allProduct = false;
        }
        yield promotion.save();
        res.redirect(`/promotion/${promotion._id}`);
    }
    catch (e) {
        next(e);
    }
});
exports.postPromotion = postPromotion;
const deletePromotion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield product_js_2.Promotion.findByIdAndRemove(req.params.id);
        const products = yield product_js_1.default.updateMany({ promotion: req.params.id }, { promotion: 'undefined' });
        res.redirect('/promotion');
    }
    catch (e) {
        next(e);
    }
});
exports.deletePromotion = deletePromotion;
