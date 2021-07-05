"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    addresses: [
        {
            _id: { id: false },
            country: { type: String },
            city: { type: String },
            street: { type: String }
        }
    ],
    cart: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Cart'
    }
});
userSchema.plugin(passport_local_mongoose_1.default);
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
