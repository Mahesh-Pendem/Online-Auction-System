const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ✅ normalize automatically
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    passwordHash: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer"
    }
  },
  {
    timestamps: true
  }
);

// ✅ Ensure index is created properly
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);