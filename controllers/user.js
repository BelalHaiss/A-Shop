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
exports.logout = exports.login = exports.renderLogin = exports.register = exports.renderRegister = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const renderRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('users/register');
});
exports.renderRegister = renderRegister;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, firstName, lastName, password, address } = req.body;
        const user = new user_js_1.default({ email, firstName, lastName, username });
        const registeredUser = yield user_js_1.default.register(user, password);
        req.login(registeredUser, (err) => {
            if (err)
                return next(err);
            user.addresses.push(address);
            req.flash('success', `Welcoem ${user.firstName}`);
            user.save();
            res.redirect('/products');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        req.flash('error', 'Please Try again with another informations');
        res.redirect('register');
    }
});
exports.register = register;
const renderLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('users/login');
});
exports.renderLogin = renderLogin;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.username === 'admin' &&
        req.user._id.toString() === process.env.adminId) {
        req.session.admin = true;
    }
    const redirectUrl = req.session.returnTo || '/products';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.admin === true) {
        delete req.session.admin;
    }
    if (req.session.returnTo) {
        delete req.session.returnTo;
    }
    req.logout();
    res.redirect('/campgrounds');
});
exports.logout = logout;
