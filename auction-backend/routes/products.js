const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/auth");

// Get all products
router.get("/", productController.listProducts);

// Get single product
router.get("/:id", productController.getProduct);

// Create product (seller only)
router.post("/", authenticate, productController.createProduct);

module.exports = router;