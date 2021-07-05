"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Promotion = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const review_1 = __importDefault(require("./review"));
const PromotionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    percent: {
        type: Number,
        min: 1,
        max: 90,
        required: [true, 'you should enter the percentage of the discount']
    },
    createdAt: {
        type: Date,
        min: '2021-06-23',
        max: '2035-05-23'
    },
    allProduct: {
        type: Boolean,
        default: false
    },
    expired: {
        type: Date,
        required: true,
        min: '2021-06-23',
        max: '2035-05-23'
    },
    active: {
        type: Boolean,
        default: true
    }
});
PromotionSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const docDate = doc.createdAt.toISOString();
        const nowDate = new Date().toISOString();
        docDate < nowDate || docDate === nowDate
            ? null
            : yield exports.Promotion.findByIdAndUpdate(doc._id, {
                active: false
            });
        if (doc.allProduct === true && (docDate < nowDate || docDate === nowDate)) {
            yield Product.updateMany({}, { promotion: doc._id });
        }
    });
});
exports.Promotion = mongoose_1.default.model('Promotion', PromotionSchema);
const productSchmea = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: [String],
        default: ['black', 'white'],
        required: true
    },
    promotion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Promotion'
    },
    size: {
        type: [Number],
        default: [37, 38, 39, 40, 41, 42, 43, 45, 46],
        required: true
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    img: {
        url: {
            type: String,
            default: process.env.defaultShoesImage
        },
        filename: { type: String }
    },
    descr: {
        type: String,
        default: 'New fancy Sneaker'
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
        default: 2
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
productSchmea.post('findOneAndRemove', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc.reviews && doc.reviews.length >= 1) {
            yield review_1.default.deleteMany({
                _id: { $in: doc.reviews }
            });
        }
    });
});
const Product = mongoose_1.default.model('Product', productSchmea);
exports.default = Product;
