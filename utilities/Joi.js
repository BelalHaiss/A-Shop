"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemToCartSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_js_1 = require("./appError.js");
const itemToCartSchema = (req, res, next) => {
    const cartSchema = joi_1.default.object({
        item: joi_1.default.object({
            qty: joi_1.default.number().required(),
            size: joi_1.default.number().required(),
            color: joi_1.default.string().required()
        }).required()
    });
    const { error } = cartSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        next(new appError_js_1.appError(msg, 400));
    }
    else {
        next();
    }
};
exports.itemToCartSchema = itemToCartSchema;
