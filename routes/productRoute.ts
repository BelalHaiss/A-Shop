import express, { Router } from 'express';
const router = Router();
const app = express();
import { itemToCartSchema } from '../utilities/Joi.js';
import { isAdmin, isAuth } from '../utilities/middleware.js';
import { storage } from '../cloudinary/cloudinary.js';
const fileSize = {
  fileSize: 1024 * 1024 * 2,
  files: 1
};
import multer from 'multer';
const upload = multer({ storage, limits: fileSize });
import {
  productsHome,
  productItem,
  addToCart,
  newProduct,
  editItemForm,
  postNewItem,
  deleteProduct,
  postEditForm
} from '../controllers/product.js';
router.route('/new').get(isAuth, isAdmin, newProduct);
router
  .route('/')
  .get(productsHome)
  .post(isAuth, isAdmin, upload.single('productImage'), postNewItem);
router
  .route('/:id')
  .post(isAuth, addToCart)
  .get(productItem)
  .patch(isAuth, isAdmin, upload.single('productImage'), postEditForm)
  .delete(isAuth, isAdmin, deleteProduct);

router.route('/:id/edit').get(isAuth, isAdmin, editItemForm);
export default router;
// (itemToCartSchema, addToCart);
