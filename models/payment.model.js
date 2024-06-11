import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
import Order from './order.model.js';

const Payment = sequelize.define('payment', {
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

Order.hasOne(Payment, {
  as: 'payment',
  foreignKey: 'order_id',
  onDelete: 'cascade',
});

Payment.belongsTo(Order, {
  foreignKey: 'order_id',
});

export default Payment;
