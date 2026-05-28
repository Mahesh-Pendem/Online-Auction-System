require("dotenv").config();

const app = require("../app");
const { connectDb } = require("../lib/db");

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
