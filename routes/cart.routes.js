import express from 'express';
import cartController from '../controller/cart.controller.js';
import middleware from '../middleware/middleware.js';

const routes = express.Router();

routes.get('/', middleware.CheckAuthorization, cartController.GetItemsInCart);
routes.post('/', middleware.CheckAuthorization, cartController.AddItemToCart);
routes.delete('/:cartId', middleware.CheckAuthorization, cartController.DeleteItemCart);
routes.put('/increment/:itemId', middleware.CheckAuthorization, cartController.IncrementQuantityCart)
routes.put("/decrement/:itemId", middleware.CheckAuthorization, cartController.DecrementQuantityCart)

export default routes;
