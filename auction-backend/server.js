require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const bidRoutes = require("./routes/bids");
const bidController = require("./controllers/bidController");

const app = express();

// Middleware
app.use(express.json());

// ✅ FIX 1: Proper CORS (supports Vite + React)
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

// ✅ FIX 2: Health check route (debugging)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/bids", bidRoutes);

// ✅ FIX 3: MongoDB connection with clear logs
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"]
  }
});

app.set("io", io);

// ✅ FIX 4: Socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(); // allow connection but no auth

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    next();
  } catch (err) {
    console.warn("⚠️ Socket auth failed:", err.message);
    next();
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Join auction room
  socket.on("joinRoom", (productId) => {
    socket.join(`product_${productId}`);
  });

  // Place bid
  socket.on("placeBid", async (data, cb) => {
    try {
      if (!socket.user) throw new Error("Not authenticated");

      const { productId, amount } = data;

      const result = await bidController.createAtomicBid(
        socket.user.id,
        productId,
        Number(amount),
        io
      );

      // ✅ FIX 5: correct response structure
      cb({ success: true, bid: result });

    } catch (err) {
      cb({ success: false, message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });

  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});