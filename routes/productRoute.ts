import express, { Router } from 'express';
const router = Router();
const app = express();
import { isAdmin, isAuth, wrapAsync } from '../utilities/middleware.js';
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
router.route('/new').get(isAuth, isAdmin, wrapAsync(newProduct));
router
  .route('/')
  .get(productsHome)
  .post(isAuth, isAdmin, upload.single('productImage'), wrapAsync(postNewItem));
router
  .route('/:id')
  .post(isAuth, wrapAsync(addToCart))
  .get(productItem)
  .patch(
    isAuth,
    isAdmin,
    upload.single('productImage'),
    wrapAsync(postEditForm)
  )
  .delete(isAuth, isAdmin, wrapAsync(deleteProduct));

router.route('/:id/edit').get(isAuth, isAdmin, wrapAsync(editItemForm));
export default router;
// (itemToCartSchema, addToCart);
