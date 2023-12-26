import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'david',
  password: 'gelang123',
  database: 'kick_store',
  logging: false
});

export default sequelize;
