import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";

// Import routes
import productRoute from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";

// Import utilities and middleware
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
})();

const app = express();
app.use(cors());

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// Basic route for checking if API is running
app.get("/", (req, res) => {
  res.send("API is running");
});

// Setup routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/paystack", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mechanics", mechanicRoutes);

// Serve static files from the "uploads" directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server using the existing Express app
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
  },
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for join event
  socket.on('join', (channelId) => {
    socket.join(channelId);
    console.log(`Client joined channel ${channelId}`);
  });

  // Listen for new message event
  socket.on('new message', (data) => {
    const { channelId, content, user } = data;
    console.log('Received new message:', data)

    // Emit the new message to all clients in the same channel
    io.to(channelId).emit('new message', data);
  });

  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
