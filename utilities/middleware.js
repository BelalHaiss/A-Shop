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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = exports.isRegisterable = void 0;
const appError_js_1 = require("./appError.js");
const isRegisterable = (req, res, next) => {
    if (req.user)
        return next(new appError_js_1.appError('you can`t sign up while your are login , you can logout and get back', 400));
    next();
};
exports.isRegisterable = isRegisterable;
const isAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.username === 'admin' &&
        req.user._id.toString() === process.env.adminId) {
        req.session.admin = true;
        next();
    }
    else {
        req.flash('error', 'Your are not authorized for this');
        return res.redirect('/products');
    }
});
exports.isAdmin = isAdmin;
