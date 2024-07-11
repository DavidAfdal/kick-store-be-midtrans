import sequelize from '../config/db.config.js';
import SnapApi from '../config/midtrans.config.js';
import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import OrderItems from '../models/orderItems.model.js';
import Transaction from '../models/payment.model.js';
import Shoe from '../models/shoe.model.js';
import User from '../models/user.model.js';
import apiRespon from '../utils/apiRespon.js';
import utils from '../utils/utils.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CheckoutProduct = async (req, res, next) => {
  const { userId } = req.user;
  const { total_price, total_items, address, phone_number } = req.body;
  const orderId = utils.GenerateOrderId();
  let result;
  try {
    const cartItems = await Cart.findAll({ where: { user_id: userId } });
    const user = await User.findOne({ where: { id: userId } });

    if (cartItems.length > 0) {
      result = await sequelize.transaction(async () => {
        const userOrder = await Order.create({ id: orderId, user_id: userId, total_price, total_items, address, phone_number });

        const orderItems = cartItems.map((data) => {
          return {
            shoe_size: data.shoe_size,
            quantity: data.quantity,
            price: data.price,
            shoe_id: data.shoe_id,
            order_id: userOrder.id,
          };
        });

         let grossAmount = 0


        cartItems.forEach((data) => {
          grossAmount += parseInt(data.price * data.quantity)
        })

        await OrderItems.bulkCreate(orderItems);

        await Cart.destroy({ where: { user_id: userId } });


        let parameter = {
          transaction_details: {
            order_id: orderId,
            gross_amount: total_price,
        },
          credit_card:{
              secure: true
          },
          customer_details: {
              first_name: user.name,
              last_name: "",
              email: user.email,
              phone: phone_number
          },
          callbacks: {
            finish: `${process.env.FRONTURL}/`
          },
        };


        const chargeResponse = await SnapApi.createTransaction(parameter);

        await Transaction.create({
          order_id: userOrder.id,
          grossAmount: parameter.transaction_details.gross_amount,
          paymentStatus: "Pending",
          paymentUrl: chargeResponse.redirect_url,
        });


        console.log(chargeResponse);

        return res.json({
          paymentUrl: chargeResponse.redirect_url
        });


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
        {
          model: Transaction,
          as: 'payment'
        }
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

const OrderDetails = async (req, res) => {
  const { orderId } = req.params;
 try {
  const orderDetail = await Order.findOne(
    {
      where: {
        id: orderId,
      }
    }, {
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
      {
        model: Transaction,
        as: 'payment'
      }
    ],
  })

  console.log(orderDetail)
  res.json(orderDetail);
 } catch (error) {
  console.log(error);
  return res.status(500).json(apiRespon.StatusIntervalServerError(error));
 }
 
}
const GetOrders = async (req, res, next) => {
  const { page = 1, pageSize = 5} = req.query;
  const offset = (page - 1) * pageSize;

  const limit = parseInt(pageSize,10);
  try {
    const orderHistory = await Order.findAndCountAll({
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
        {
          model: Transaction,
          as: 'payment'
        }
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
  GetOrders,
  OrderDetails

};
