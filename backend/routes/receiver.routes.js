// backend/routes/receiver.routes.js
import express from "express";
import Receiver from "../models/receiver.model.js";
import { upload } from "../middlewares/upload.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// POST /api/receiver/update-profile
router.post(
  "/update-profile",
  isAuth, // ✅ auth middleware
  upload.single("image"),
  async (req, res) => {
    try {
      const { fullName, email, mobile, address, organization } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      let receiver = await Receiver.findOne({ user: req.userId });

      if (!receiver) {
        // create new receiver
        receiver = new Receiver({
          user: req.userId,
          fullName,
          email,
          mobile,
          address,
          organization,
          image,
        });
      } else {
        // update existing
        receiver.fullName = fullName;
        receiver.email = email;
        receiver.mobile = mobile;
        receiver.address = address;
        receiver.organization = organization;
        if (image) receiver.image = image;
      }

      await receiver.save();
      res.status(200).json(receiver);
    } catch (err) {
      console.error("Receiver update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/receiver/get-my
router.get("/get-my", isAuth, async (req, res) => {
  try {
    const receiver = await Receiver.findOne({ user: req.userId });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });
    res.status(200).json(receiver);
  } catch (err) {
    console.error("Get receiver error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
