import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import Shoe from './shoe.model.js';

const OrderItems = sequelize.define('OrderItems', {
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

OrderItems.belongsTo(Shoe);
Shoe.hasMany(OrderItems);

export default OrderItems;
