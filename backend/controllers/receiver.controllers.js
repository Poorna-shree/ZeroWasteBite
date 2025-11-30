import Receiver from "../models/receiver.model.js";
import User from "../models/user.model.js";

export const createReceiverProfile = async (req, res) => {
  try {
    const { fullName, email, mobile, city, state, address } = req.body;

    // Fetch user
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Block donor
    if (user.role === "donor") {
      return res.status(403).json({ message: "Donors cannot create receiver profile" });
    }

    // Check for existing profile
    let profile = await Receiver.findOne({ user: req.userId });

    const imageFileName = req.file ? req.file.filename : undefined;

    if (profile) {
      // Update existing
      profile.fullName = fullName;
      profile.email = email;
      profile.mobile = mobile;
      profile.city = city;
      profile.state = state;
      profile.address = address;
      if (imageFileName) profile.image = imageFileName;
      await profile.save();
      return res.status(200).json(profile);
    }

    // Create new
    profile = new Receiver({
      user: req.userId,
      fullName,
      email,
      mobile,
      city,
      state,
      address,
      image: imageFileName,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("Receiver controller error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyReceiverProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "donor") {
      return res.status(403).json({ message: "Donors cannot have receiver profile" });
    }

    const profile = await Receiver.findOne({ user: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    console.error("Get receiver profile error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
