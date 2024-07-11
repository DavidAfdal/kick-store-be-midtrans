import express from 'express';
import orderController from '../controller/order.controller.js';
import middleware from '../middleware/middleware.js';

const routes = express.Router();

routes.get('/orders', orderController.GetOrders);
routes.post('/checkout', middleware.CheckAuthorization, orderController.CheckoutProduct);
routes.get('/history', middleware.CheckAuthorization, orderController.GetHistoryOrder);
routes.get('/orders/:orderId', orderController.OrderDetails);

export default routes;
