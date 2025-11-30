import express from "express";
import Donor from "../models/donor.model.js";
import { upload } from "../middlewares/upload.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

/**
 * POST /api/donor/create-edit
 * Create or update donor profile
 */
router.post("/create-edit", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { fullName, email, mobile, city, state, address } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let donor = await Donor.findOne({ user: req.userId });

    if (!donor) {
      // ✅ Create new donor profile
      donor = new Donor({
        user: req.userId,
        fullName,
        email,
        mobile,
        city,
        state,
        address,
        image,
      });
    } else {
      // ✅ Update existing profile
      donor.fullName = fullName;
      donor.email = email;
      donor.mobile = mobile;
      donor.city = city;
      donor.state = state;
      donor.address = address;
      if (image) donor.image = image; // only update if new image uploaded
    }

    await donor.save();
    res.status(200).json(donor);
  } catch (error) {
    console.error("❌ Donor create-edit error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/donor/get-my
 * Fetch donor profile for logged-in user
 */
router.get("/get-my", isAuth, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.userId });
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.status(200).json(donor);
  } catch (error) {
    console.error("❌ Donor get-my error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
