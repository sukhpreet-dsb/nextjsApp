import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const RefreshToken =
  mongoose.models.refreshToken ||
  mongoose.model("refreshToken", refreshTokenSchema);

export default RefreshToken;
