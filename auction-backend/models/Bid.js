const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    bidderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: [1, "Bid amount must be greater than 0"]
    }
  },
  {
    timestamps: true // ✅ automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Bid", bidSchema);