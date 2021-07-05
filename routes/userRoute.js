"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const middleware_js_1 = require("../utilities/middleware.js");
const user_js_1 = require("../controllers/user.js");
router.route('/register').get(middleware_js_1.isRegisterable, user_js_1.renderRegister).post(user_js_1.register);
router
    .route('/login')
    .get(user_js_1.renderLogin)
    .post(passport_1.default.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), user_js_1.login);
router.get('/logout', middleware_js_1.isAuth, user_js_1.logout);
exports.default = router;
