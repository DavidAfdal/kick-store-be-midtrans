import sequelize from '../config/db.config.js';
import {DataTypes}from 'sequelize';
import Size from './size.model.js';

const Shoe = sequelize.define('shoe', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  diskon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Shoe.hasMany(Size, {
  as: 'sizes',
  foreignKey: 'shoe_id',
  onDelete: 'cascade',
});

Size.belongsTo(Shoe, {
  foreignKey: 'shoe_id',
});

(async () => {
  await sequelize.sync();
  // Code here
})();

export default Shoe;
