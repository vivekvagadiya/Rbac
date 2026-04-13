import mongoose from "mongoose";

const roleSchema = new mongoose.schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", roleSchema);