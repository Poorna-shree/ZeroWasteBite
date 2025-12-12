// index.js (or your main server file)
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import path from "path";

// Routes
import donationRouter from "./routes/donation.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import donorRouter from "./routes/donor.routes.js";
import marketPriceRouter from "./routes/marketPrice.js";
import receiverRoutes from "./routes/receiver.routes.js";
import chatRouter from "./routes/chat.routes.js"; // ✅ Chatbot route

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://zwb.onrender.com",
    credentials: true,
    methods: ["POST", "GET"],
  },
});

app.set("io", io);

const port = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "https://zwb.onrender.com",
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads"))); 

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/donor", donorRouter);
app.use("/api/receiver", receiverRoutes);
app.use("/api/market-price", marketPriceRouter);
app.use("/api/donations", donationRouter);
app.use("/api/chat", chatRouter); // ✅ Added Chat route

// Socket.io
socketHandler(io);

// Start server
server.listen(port, async () => {
  await connectDb();
  console.log(`Server started at port ${port}`);
});
