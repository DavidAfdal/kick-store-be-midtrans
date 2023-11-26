import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import User from './user.model.js';
import Shoe from './shoe.model.js';

const Cart = sequelize.define('Cart', {
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

User.hasMany(Cart);
Cart.belongsTo(User);

Shoe.hasMany(Cart);
Cart.belongsTo(Shoe);

export default Cart;
