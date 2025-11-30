// routes/chat.routes.js
import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getChatByShopOrderId, sendMessage } from "../controllers/chat.controllers.js";

const router = express.Router();

// Use shopOrderId as the route param
router.get("/:shopOrderId", isAuth, getChatByShopOrderId);
router.post("/send", isAuth, sendMessage);

export default router;
