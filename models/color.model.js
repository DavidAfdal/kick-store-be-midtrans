import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';

const Color = sequelize.define('color', {
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  color: {
    type: DataTypes.STRING,
  },
});

export default Color;
