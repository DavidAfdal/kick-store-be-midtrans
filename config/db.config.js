import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port:process.env.DB_PORT,
  logging: false
});

// const sequelize = new Sequelize("https://leewmwaylxnmtjdhuydq.supabase.co", {})

export default sequelize;
