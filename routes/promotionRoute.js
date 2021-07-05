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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = express_1.Router({ mergeParams: true });
const app = express_1.default();
const middleware_js_1 = require("../utilities/middleware.js");
const promotion_1 = require("../controllers/promotion");
router
    .route('/')
    .get(middleware_js_1.isAuth, middleware_js_1.isAdmin, promotion_1.showAllPromotions)
    .post(middleware_js_1.isAuth, middleware_js_1.isAdmin, promotion_1.postPromotion);
router.route('/new').get(middleware_js_1.isAuth, middleware_js_1.isAdmin, promotion_1.promotionPageForm);
router
    .route('/:id')
    .get(middleware_js_1.isAuth, middleware_js_1.isAdmin, promotion_1.showSinglePromotion)
    .delete(middleware_js_1.isAuth, middleware_js_1.isAdmin, promotion_1.deletePromotion);
exports.default = router;
