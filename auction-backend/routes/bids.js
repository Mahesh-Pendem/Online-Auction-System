const express = require("express");
const router = express.Router({ mergeParams: true });

const bidController = require("../controllers/bidController");
const { authenticate } = require("../middleware/auth");

// GET all bids for a product
// /api/products/:productId/bids
router.get("/", bidController.getBids);

// POST place a bid
// /api/products/:productId/bids
router.post("/", authenticate, bidController.placeBidHTTP);

module.exports = router;