"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    products: [
        {
            _id: { id: false },
            item: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product'
            },
            cartQty: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
exports.Cart = mongoose_1.default.model('Cart', cartSchema);
