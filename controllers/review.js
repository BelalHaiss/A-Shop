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
exports.deleteReview = exports.postReview = void 0;
const review_js_1 = __importDefault(require("../models/review.js"));
const product_js_1 = __importDefault(require("../models/product.js"));
const postReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield product_js_1.default.findById(req.params.id);
        const review = yield review_js_1.default.create(req.body.review);
        review.author = req.user._id;
        review.save();
        item.reviews.push(review);
        yield item.save();
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {
        next(e);
        // next(new appError('u have add a wrong rating info', 400));
    }
});
exports.postReview = postReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, reviewID } = req.params;
    const reviewAuthor = yield review_js_1.default.findById(reviewID);
    if (!reviewAuthor.author.equals(req.user._id)) {
        req.flash('error', 'you don`t have permisson for that');
        return res.redirect(`/products/${id}`);
    }
    const item = yield product_js_1.default.findByIdAndUpdate(id, {
        $pull: { reviews: reviewID }
    });
    yield review_js_1.default.findByIdAndDelete(reviewID);
    res.redirect(`/products/${id}`);
});
exports.deleteReview = deleteReview;
