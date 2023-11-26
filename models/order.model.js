import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import OrderItems from './orderItems.model.js';
import User from './user.model.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_items: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Order.hasMany(OrderItems);
OrderItems.belongsTo(Order);
User.hasMany(Order);
Order.belongsTo(User);

export default Order;
