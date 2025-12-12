import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model for login
      required: true,
    },
    foodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // URL or filename if you support uploads
    },
    status: {
      type: String,
      enum: ["Available", "Collected", "Expired"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
