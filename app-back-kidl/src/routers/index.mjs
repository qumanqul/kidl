import { Router } from "express";
import productsRouter from "./products.mjs";
import auth  from "./auth.mjs";
import order from "./orders.mjs";
import admin from "./admin.mjs";

const router = Router();

router.use(productsRouter);
router.use(auth);
router.use(order);
router.use(admin);


export default router;