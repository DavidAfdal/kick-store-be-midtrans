import express from 'express';
import { GetDataDashboard } from '../controller/dashboard.controller.js';


const router = express.Router();

router.get('/', GetDataDashboard);


export default router;