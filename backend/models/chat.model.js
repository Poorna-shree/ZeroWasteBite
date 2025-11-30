import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderType: { type: String, enum: ["customer", "owner", "delivery"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: true });

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  role: { type: String, enum: ["customer", "owner", "delivery"] },
  phone: String,
});

const chatSchema = new mongoose.Schema({
  shopOrderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  participants: [participantSchema],
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
