import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import Shoe from './shoe.model.js';

const Image = sequelize.define('image', {
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

Shoe.hasMany(Image, {
  as: 'images',
  foreignKey: 'shoe_id',
  onDelete: 'cascade',
});

Image.belongsTo(Shoe, {
  foreignKey: 'shoe_id',
});

export default Image;
