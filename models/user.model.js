import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
   type: DataTypes.BOOLEAN,
   defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'ROOKIE',
  },
  googleLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

export default User;
