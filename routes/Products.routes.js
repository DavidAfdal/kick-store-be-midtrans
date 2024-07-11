import express from 'express';
import productController from '../controller/product.controller.js';
import upload from '../config/multer.config.js';


const router = express.Router();

router.get('/', productController.PaginationShoes);
router.get('/recomand', productController.RecomandShoes);
router.get('/:id', productController.GetShoesById);
router.post('/',  upload.fields([
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]),
productController.CreateShoe);

router.post(`/addSize/:id`, productController.AddSize);

router.patch('/update/:id',  upload.fields([
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]),
productController.UpdateShoe);


router.delete('/:id', productController.DeleteShoe);
router.delete(`/deleteSize/:id`, productController.DeleteSize);

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
