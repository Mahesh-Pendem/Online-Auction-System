const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    // Auth check
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only sellers can create auctions" });
    }

    let { title, description, startingBid, endTime } = req.body;

    // ✅ Validate required fields
    if (!title || !startingBid || !endTime) {
      return res.status(400).json({ message: "Title, startingBid, and endTime are required" });
    }

    // ✅ Convert & validate startingBid
    startingBid = Number(startingBid);
    if (isNaN(startingBid) || startingBid <= 0) {
      return res.status(400).json({ message: "Invalid starting bid" });
    }

    // ✅ Validate endTime
    const parsedEndTime = new Date(endTime);
    if (isNaN(parsedEndTime.getTime())) {
      return res.status(400).json({ message: "Invalid end time format" });
    }

    // ✅ Check future time
    if (parsedEndTime <= new Date()) {
      return res.status(400).json({ message: "End time must be in the future" });
    }

    // Create product
    const product = await Product.create({
      seller: req.user.id,
      title,
      description: description || "",
      startingBid,
      currentBid: startingBid,
      endTime: parsedEndTime,
      status: "active",
      bids: [], // ✅ initialize
      highestBidder: null // ✅ initialize
    });

    res.status(201).json(product);

  } catch (err) {
    console.error("Create product error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST PRODUCTS
exports.listProducts = async (req, res) => {
  try {
    const items = await Product.find()
      .populate("seller", "name email")
      .lean();

    res.json(items);

  } catch (err) {
    console.error("List products error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.error("Get product error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};