const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const bidRoutes = require("./routes/bids");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

const app = express();

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/\.vercel\.app$/i.test(new URL(origin).hostname)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true
  })
);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/bids", bidRoutes);

module.exports = app;
