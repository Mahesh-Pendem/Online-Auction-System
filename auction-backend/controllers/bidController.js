const Bid = require("../models/Bid");
const Product = require("../models/Product");
const { Types: { ObjectId } } = require("mongoose");

// Get all bids for a product
exports.getBids = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const bids = await Bid.find({ productId })
      .sort({ amount: -1 })
      .populate("bidderId", "name email");

    res.json(bids);

  } catch (err) {
    console.error("Get bids error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Place a bid via HTTP
exports.placeBidHTTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    let { amount } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    amount = Number(amount);

    // ✅ Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ FIX: correct field name
    const currentHighest = product.currentBid || product.startingBid;

    if (amount <= currentHighest) {
      return res.status(400).json({
        message: `Bid must be greater than current bid (${currentHighest})`
      });
    }

    // Save bid
    const bid = new Bid({
      bidderId: userId,
      productId,
      amount
    });

    await bid.save();

    // ✅ Update product
    product.currentBid = amount;
    product.highestBidder = userId;

    // ✅ Keep history inside product (optional but useful)
    product.bids.push({
      bidder: userId,
      amount
    });

    await product.save();

    res.json({ success: true, bid });

  } catch (err) {
    console.error("Place bid error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Place bid via Socket.IO
exports.createAtomicBid = async (userId, productId, amount, io) => {

  if (!ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  amount = Number(amount);

  if (!amount || amount <= 0) {
    throw new Error("Invalid bid amount");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // ✅ FIX: correct field
  const currentHighest = product.currentBid || product.startingBid;

  if (amount <= currentHighest) {
    throw new Error(`Bid must be greater than current bid (${currentHighest})`);
  }

  const bid = new Bid({
    bidderId: userId,
    productId,
    amount
  });

  await bid.save();

  product.currentBid = amount;
  product.highestBidder = userId;

  product.bids.push({
    bidder: userId,
    amount
  });

  await product.save();

  // Emit live update
  io.to(`product_${productId}`).emit("newBid", {
    amount,
    bidder: userId
  });

  return bid;
};