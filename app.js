import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import CartRoutes from "./modules/cart/cart.routes.js";

import Productroutes from "./routes/Products.routes.js";
import AuthRoutes from "./routes/auth.routes.js";

import OrderRoutes from "./routes/orders.routes.js";
import DashboardRoutes from "./routes/dashboard.routes.js";

import authController from "./controller/auth.controller.js";

import { CONFIG } from "./config/envirotment.config.js";

import middleware from "./middleware/middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.set("view engine", "ejs");
app.use(
  cors({
    origin: CONFIG.app.node_env  != "DEV" ? CONFIG.app.frontend_url : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/v1/shoes", Productroutes);
app.use("/v1/auth", AuthRoutes);
app.use("/v1/cart", CartRoutes);
app.use("/v1/order", OrderRoutes);
app.use("/v1/dashboard", DashboardRoutes);

// View routes
app.get("/forget-password/:id", (req, res) => {
  res.render("pages/forget", { id: req.params.id });
});

app.post("/reset-password/:id", authController.ResetPassword);
app.get("/active/:id", authController.ActivateAccount);

app.use(middleware.errorHandler)


export default app