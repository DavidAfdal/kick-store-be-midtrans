import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
import Order from './order.model.js';

const Transaction = sequelize.define('payment', {
  grossAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Order.hasOne(Transaction, {
  as: 'payment',
  foreignKey: 'order_id',
  onDelete: 'cascade',
});

Transaction.belongsTo(Order, {
  foreignKey: 'order_id',
});

export default Transaction;
