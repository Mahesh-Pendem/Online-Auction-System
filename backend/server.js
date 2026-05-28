require("dotenv").config();
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const app = require("./app");
const { connectDb } = require("./lib/db");

const bidController = require("./controllers/bidController");

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean)
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

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });