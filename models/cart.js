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
exports.Order = exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_js_1 = __importDefault(require("./user.js"));
const cartSchema = new mongoose_1.default.Schema({
    products: [
        {
            _id: { id: false },
            item: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product'
            },
            cartQty: { type: Number, required: true },
            size: { type: Number, required: true },
            color: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, required: true }
        }
    ],
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
cartSchema.post('findOneAndRemove', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc.user) {
            const pullCartFromUser = yield user_js_1.default.findByIdAndUpdate(doc.user, {
                cart: undefined
            });
        }
    });
});
exports.Cart = mongoose_1.default.model('Cart', cartSchema);
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    }
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
