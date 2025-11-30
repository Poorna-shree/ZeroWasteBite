import mongoose from "mongoose";

const receiverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String }, // optional profile image
}, { timestamps: true });

export default mongoose.model("Receiver", receiverSchema);
