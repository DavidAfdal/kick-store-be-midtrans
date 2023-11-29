import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import OrderItems from './orderItems.model.js';
import User from './user.model.js';

const Order = sequelize.define('order', {
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

Order.hasMany(OrderItems, {
  as: 'order_items',
  foreignKey: 'order_id',
  onDelete: 'cascade',
});

OrderItems.belongsTo(Order, {
  foreignKey: 'order_id',
});

User.hasMany(Order, {
  as: 'orders',
  foreignKey: 'user_id',
  onDelete: 'cascade',
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
});

export default Order;
