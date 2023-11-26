import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import Shoe from './shoe.model.js';

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'DEFAULT',
  },
});

Image.belongsTo(Shoe);
Shoe.hasMany(Image);

export default Image;
