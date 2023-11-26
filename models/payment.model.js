import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import Order from './order.model.js';

const Payment = sequelize.define('Payment', {
  grossAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Order.hasOne(Payment);
Payment.belongsTo(Order);

export default Payment;
