// models/donation.model.js
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: String,
    donorPhone: String,

    // ✅ Receiver info
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverName: String,
    receiverPhone: String,

    foodType: { type: String, required: true },
    quantity: { type: String, required: true },
    location: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    description: String,
    status: {
      type: String,
      enum: ["Available", "Collected", "Expired"],
      default: "Available",
    },
  },
  { timestamps: true }
);


export default mongoose.model("Donation", donationSchema);
