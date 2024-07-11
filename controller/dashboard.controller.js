
import Order from '../models/order.model.js';
import Shoe from '../models/shoe.model.js';
import OrderItems from '../models/orderItems.model.js';
import User from '../models/user.model.js';
import Size from '../models/size.model.js';
import Transaction from '../models/payment.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import sequelize from '../config/db.config.js';

const GetDataDashboard = async (req, res, next) => {
    try {

        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
    
        // Fetch orders for the current month
        const orders = await Order.findAll({
          where: {
            createdAt: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
          include: [
            {
              model: OrderItems,
              as: 'order_items',
            },
            {
              model: User,
              as: 'user',
            },
            {
              model: Transaction,
              as: 'payment',
              where: {
            paymentStatus: 'Success',
          },
            },
          ],
        });
        
      const totalStock = await Shoe.findAll({
        attributes: [
          'id', // Ensure you have the shoe ID or other unique identifier
          'name',
          'description',
          'price',
          'diskon',
          'category',
          'type',
          [sequelize.fn('SUM', sequelize.col('sizes.stock')), 'totalStock']
        ],
        include: [
          {
            model: Size,
            as: 'sizes',
            attributes: [] // We only need the sum of stocks, not individual size records
          }
        ],
        group: ['shoe.id'], // Group by shoe ID
      });


      let totalProduct = 0

      let revanueMonth = 0

      let salesMonth = 0


      orders.forEach((order) => {
          revanueMonth += order.dataValues.total_price,
          salesMonth += order.dataValues.total_items
      })

      totalStock.forEach((item) => {
        totalProduct += parseInt(item.dataValues.totalStock)
      })
  
      res.status(200).json({
        totalStock: totalProduct,
        revanueMonth: revanueMonth,
        salesMonth: salesMonth
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  };

  export {
    GetDataDashboard
  }