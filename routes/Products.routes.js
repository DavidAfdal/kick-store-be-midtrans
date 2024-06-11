import express from 'express';
import productController from '../controller/product.controller.js';
import colorController from '../controller/color.controller.js';
import upload from '../config/multer.config.js';


const router = express.Router();

router.get('/', productController.PaginationShoes);
router.get('/color', colorController.GetAllColor);
router.get('/recomand', productController.RecomandShoes);
router.get('/:id', productController.GetShoesById);
router.post('/', productController.CreateShoe);
router.post('/color', colorController.CreateColor);
router.post(
  '/addImage/:id',
  upload.fields([
    {
      name: 'thumbnail',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 3,
    },
  ]),
  productController.AddImage
);

export default router;
