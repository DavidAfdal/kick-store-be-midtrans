import sequelize from '../config/db.config.js';
import CoreApi from '../config/midtrans.config.js';
import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import OrderItems from '../models/orderItems.model.js';
import Payment from '../models/payment.model.js';
import Shoe from '../models/shoe.model.js';
import apiRespon from '../utils/apiRespon.js';
import utils from '../utils/utils.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CheckoutProduct = async (req, res, next) => {
  const { userId } = req.user;
  const { total_price, total_items, card_number, card_exp_month, card_exp_year, card_cvv, address, phone_number } = req.body;
  const orderId = utils.GenerateOrderId();
  let cardParameter = {
    card_number: card_number,
    card_exp_month: card_exp_month,
    card_exp_year: card_exp_year,
    card_cvv: card_cvv,
    client_key: process.env.MIDTRANS_CLIENT_KEY,
  };

  let result;
  try {
    const cartItems = await Cart.findAll({ where: { user_id: userId } });

    if (cartItems.length > 0) {
      result = await sequelize.transaction(async () => {
        const userOrder = await Order.create({ id: orderId, user_id: userId, total_price, total_items, address, phone_number });

        const orderItems = cartItems.map((data) => {
          return {
            shoe_color: data.shoe_color,
            shoe_size: data.shoe_size,
            quantity: data.quantity,
            price: data.price,
            shoe_id: data.shoe_id,
            order_id: userOrder.id,
          };
        });

        await OrderItems.bulkCreate(orderItems);

        await Cart.destroy({ where: { user_id: userId } });

        const data = await CoreApi.cardToken(cardParameter);

        let parameter = {
          payment_type: 'credit_card',
          transaction_details: {
            gross_amount: total_price,
            order_id: userOrder.id,
          },
          credit_card: {
            token_id: data.token_id,
          },
        };
    
        const chargeResponse = await CoreApi.charge(parameter);
    
        await Payment.create({
          order_id: userOrder.id,
          grossAmount: chargeResponse.gross_amount,
          paymentStatus: chargeResponse.transaction_status,
          paymentTime: chargeResponse.transaction_time,
        });

        return res.json(apiRespon.StatusCreated("Transaction Success"))


      });
    } else {
      return res.json(apiRespon.StatusNotFound("Can't Checkout, your cart is empty", 'cart empty'));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }

};

const GetHistoryOrder = async (req, res, next) => {
  const { userId } = req.user;
  const { page = 1, pageSize = 5} = req.query;
  const offset = (page - 1) * pageSize;

  const limit = parseInt(pageSize,10);
  try {
    const orderHistory = await Order.findAndCountAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: OrderItems,
          as: 'order_items',
          include: [ 
            {
              model: Shoe,
              attributes: [
                'name',
                'category',
                'type',
                [
                  sequelize.literal(`(SELECT url FROM images as image  WHERE image.shoe_id = order_items.shoe_id AND image.type = 'THUMBNAIL')`),'thumbImg',
                ],
              ],
            },
          ],
        },
      ],
      offset,
      limit, 
      order : [["createdAt", "DESC"]],
      distinct: true
    });

    res.json({
      totalItems: orderHistory.count,
      totalPages: Math.ceil(orderHistory.count / pageSize),
      currentPage: page,
      data: orderHistory.rows,
    });
  
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  CheckoutProduct,
  GetHistoryOrder,
};
