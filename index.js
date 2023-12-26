import express from 'express';
import Productroutes from './routes/Products.routes.js';
import AuthRoutes from './routes/auth.routes.js';
import CartRoutes from './routes/cart.routes.js';
import OrderRoutes from './routes/orders.routes.js';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.use('/api/shoe', Productroutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/order', OrderRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    code: 500,
    status: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
