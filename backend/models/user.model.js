import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    // required: true // uncomment if password is always mandatory
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"]
  },
  role: {
    type: String,
    enum: ["user", "owner", "deliveryBoy","reduceWasteVolunteer"],
    required: true
  },
  resetOtp: {
    type: String
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otpExpires: {
    type: Date
  },
  socketId:{
    type:String
  },
  isOnline:{
    type: Boolean,
    default: false
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);

export default User;
