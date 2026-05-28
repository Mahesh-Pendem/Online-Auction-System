const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for bids
const bidSubSchema = new Schema(
  {
    bidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Bid must be greater than 0"]
    }
  },
  { timestamps: true, _id: false }
);

// Main product schema
const productSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    startingBid: {
      type: Number,
      required: true,
      min: [1, "Starting bid must be greater than 0"]
    },

    currentBid: {
      type: Number,
      default: null
    },

    highestBidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    currency: {
      type: String,
      default: "INR"
    },

    endTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active"
    },

    bids: [bidSubSchema]
  },
  {
    timestamps: true
  }
);

// Optional: auto-update status when fetching
productSchema.methods.isActive = function () {
  return this.status === "active" && new Date() < this.endTime;
};

module.exports = mongoose.model("Product", productSchema);