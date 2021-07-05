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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const router = express_1.Router();
const app = express_1.default();
const middleware_js_1 = require("../utilities/middleware.js");
const cloudinary_js_1 = require("../cloudinary/cloudinary.js");
const fileSize = {
    fileSize: 1024 * 1024 * 2,
    files: 1
};
const multer_1 = __importDefault(require("multer"));
const upload = multer_1.default({ storage: cloudinary_js_1.storage, limits: fileSize });
const product_js_1 = require("../controllers/product.js");
router.route('/new').get(middleware_js_1.isAuth, middleware_js_1.isAdmin, product_js_1.newProduct);
router
    .route('/')
    .get(product_js_1.productsHome)
    .post(middleware_js_1.isAuth, middleware_js_1.isAdmin, upload.single('productImage'), product_js_1.postNewItem);
router
    .route('/:id')
    .post(middleware_js_1.isAuth, product_js_1.addToCart)
    .get(product_js_1.productItem)
    .patch(middleware_js_1.isAuth, middleware_js_1.isAdmin, upload.single('productImage'), product_js_1.postEditForm)
    .delete(middleware_js_1.isAuth, middleware_js_1.isAdmin, product_js_1.deleteProduct);
router.route('/:id/edit').get(middleware_js_1.isAuth, middleware_js_1.isAdmin, product_js_1.editItemForm);
exports.default = router;
// (itemToCartSchema, addToCart);
