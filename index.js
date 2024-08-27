import express from 'express';
import Productroutes from './routes/Products.routes.js';
import AuthRoutes from './routes/auth.routes.js';
import CartRoutes from './routes/cart.routes.js';
import OrderRoutes from './routes/orders.routes.js';
import DashboardRoutes from './routes/dashboard.routes.js';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authController from './controller/auth.controller.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = 5000;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(cors({
  origin: 'https://www.kicksstore.site',
  methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use('/api/shoe', Productroutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/order', OrderRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use((err, req, res, next) => {
  console.log(err.code);
  res.status(err.code).json({
    code: err.code ? err.code : 500,
    status: 'Error',
    message: err.message,
    error: err.message,
  });
});


app.get("/forget-password/:id", (req, res) => {
  const {id} = req.params
  res.render("pages/forget", {id})
})

app.post("/reset-password/:id", authController.ResetPassword);
app.get("/active/:id", authController.ActivateAccount);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
