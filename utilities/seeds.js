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
const mongoose_1 = __importDefault(require("mongoose"));
const user_js_1 = __importDefault(require("../models/user.js"));
const dbUrl = 'mongodb://localhost:27017/a-shop';
mongoose_1.default
    .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
    console.log('Mongo server Running');
})
    .catch((e) => {
    console.log('Error with the Mongo Server');
    console.log(e);
});
const seeds = () => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_js_1.default.deleteOne({ email: 'admin@gmail.com' });
    console.log(newUser);
});
seeds();
// Product.findById('60d245bf84989b47e49a874c').then((res: void) => {
//   console.log(res);
// });
