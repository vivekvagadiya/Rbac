const mongoose = require("mongoose");
const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    module: {
      type: String,
      required: true,
      enum: ["user", "role", "product", "order", "category", "permission"],
    },
    action: {
      type: String,
      enum: ["create", "read", "update", "delete"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Permission", permissionSchema);
