import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
const Size = sequelize.define('size', {
  size: {
    type: DataTypes.INTEGER,
  },
  stock: {
    type: DataTypes.INTEGER,
  },
});

export default Size;
