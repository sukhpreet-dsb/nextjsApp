import mongoose from "mongoose";

const ToduSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Todu = mongoose.models.tudo || mongoose.model("tudo", ToduSchema);

export default Todu;
