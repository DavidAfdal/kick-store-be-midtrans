import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
import Shoe from './shoe.model.js';

const OrderItems = sequelize.define('orderItems', {
  shoe_color: {
    type: DataTypes.STRING,
  },
  shoe_size: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.INTEGER,
  },
});

Shoe.hasMany(OrderItems, {
  as: 'order_items',
  foreignKey: 'shoe_id',
  onDelete: 'cascade',
});

OrderItems.belongsTo(Shoe, {
  foreignKey: 'shoe_id',
});

export default OrderItems;
