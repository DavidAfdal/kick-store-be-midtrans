import sequelize from '../config/db.config.js';
import { DataTypes } from 'sequelize';
import Color from './color.model.js';
import Size from './size.model.js';

const Shoe = sequelize.define('Shoe', {
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

Shoe.belongsToMany(Color, { through: 'SHOECOLOR' });
Shoe.hasMany(Size);
Size.belongsTo(Shoe);

(async () => {
  await sequelize.sync();
  // Code here
})();

export default Shoe;
