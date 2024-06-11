import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
import User from './user.model.js';
import Shoe from './shoe.model.js';

const Cart = sequelize.define('cart', {
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

User.hasMany(Cart, {
  as: 'carts',
  foreignKey: 'user_id',
  onDelete: 'cascade',
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
});

Shoe.hasMany(Cart, {
  as: 'carts',
  foreignKey: 'shoe_id',
  onDelete: 'cascade',
});

Cart.belongsTo(Shoe, {
  foreignKey: 'shoe_id',
});

export default Cart;
