import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import socket from "./config/socket.js";
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
})();

const app = express();
app.use(cors());

// Create HTTP server using existing Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
socket(server);

// Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/products", productRoute);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/paystack", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});