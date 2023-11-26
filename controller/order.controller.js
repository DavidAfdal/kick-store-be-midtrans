import sequelize from '../config/db.config.js';
import CoreApi from '../config/midtrans.config.js';
import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import OrderItems from '../models/orderItems.model.js';
import Payment from '../models/payment.model.js';
import apiRespon from '../utils/apiRespon.js';
import utils from '../utils/utils.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CheckoutProduct = async (req, res, next) => {
  const { userId } = req.user;
  const { total_price, total_items, card_number, card_exp_month, card_exp_year, card_cvv } = req.body;
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
    const cartItems = await Cart.findAll({ where: { UserId: userId } });

    if (cartItems.length > 0) {
      result = await sequelize.transaction(async () => {
        const userOrder = await Order.create({ UserId: userId, id: orderId, total_items, total_price });

        const orderItems = cartItems.map((data) => {
          return {
            shoe_color: data.shoe_color,
            shoe_size: data.shoe_size,
            quantity: data.quantity,
            price: data.price,
            ShoeId: data.ShoeId,
            OrderId: userOrder.id,
          };
        });

        const dataOrder = await OrderItems.bulkCreate(orderItems);

        await Cart.destroy({ where: { UserId: userId } });

        return {
          order: userOrder,
          orderItems: dataOrder,
        };
      });
    } else {
      return res.json(apiRespon.StatusNotFound("Can't Checkout, your cart is empty", 'cart empty'));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }

  let data;
  try {
    data = await CoreApi.cardToken(cardParameter);
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }

  try {
    let parameter = {
      payment_type: 'credit_card',
      transaction_details: {
        gross_amount: total_price,
        order_id: result.order.id,
      },
      credit_card: {
        token_id: data.token_id,
      },
    };

    const chargeResponse = await CoreApi.charge(parameter);

    await Payment.create({
      OrderId: result.order.id,
      grossAmount: chargeResponse.gross_amount,
      paymentStatus: chargeResponse.transaction_status,
      paymentTime: chargeResponse.transaction_time,
    });

    return res.json(apiRespon.StatusCreated('Checkout Berhasil'));
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const GetHistoryOrder = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const orderHistory = await Order.findAll({
      where: {
        UserId: userId,
      },
      include: [
        {
          model: OrderItems,
        },
        {
          model: Payment,
        },
      ],
    });
    res.json(apiRespon.StatusGetData('Succes Get Data', orderHistory));
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  CheckoutProduct,
  GetHistoryOrder,
};
